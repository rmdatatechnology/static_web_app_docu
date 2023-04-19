const { Client } = require('@elastic/elasticsearch');
const chunk = require('lodash.chunk');
const report = require('gatsby-cli/lib/reporter');

let activity = report.activityTimer(`Indexing to ElasticSearch`);

/**
 * give back the same thing as this was called with.
 *
 * @param {any} obj what to keep the same
 */
const identity = (obj) => obj;
var type = '_doc';

exports.onPostBuild = async function (
  { graphql },
  { node, apiKey, auth, queries, useindex }
) {
  activity.start();

  if(!useindex || useindex === false || useindex === "false")
	  return;
  
  const config = { node: node };
  if (auth) {
    config['auth'] = auth;
  } else if (apiKey) {
    config['auth'] = { apiKey: apiKey };
  }
  const client = new Client(config);

  if (typeof queries === 'function') {
    queries = await Promise.all(await queries(graphql));
  }

  setStatus(activity, `${queries.length} queries to index`);

  const jobs = queries.map(async function doQuery(
    { indexName: alias, query, transformer = identity },
    i
  ) {
    if (!query) {
      report.panic(
        `failed to index to Elasticsearch. You did not give "query" to this query`
      );
    }

    if (typeof query === 'function') {
      query = await query(graphql);
    }
    if (typeof alias === 'function') {
      alias = await alias(graphql);
    }

    await deleteOrphanIndices(client, alias);
    const newIndex = await getUniqueIndexName(client, alias);

    await createIndex(client, newIndex);
	
	setStatus(activity, `create index`);
    
    await setSettings(client, newIndex);
	
    setStatus(activity, `query ${i}: executing query`);
    const result = await graphql(query);
    if (result.errors) {
      report.panic(`failed to index to ElasticSearch`, result.errors);
    }
    const objects = await transformer(result);
	
	setStatus(activity, `create update elements`);
	
	async function * generator () {
  
	for (const doc of objects) {
		yield doc
	}
	}

    const r = await client.helpers.bulk({
	  datasource: generator(),
	  onDocument (doc) {
		return {
		  index: { _index: newIndex }
		}
	  }
	})

	setStatus(activity, r);
	const insertedCount = objects.length;
    setStatus(
      undefined,
      `inserted ${insertedCount} of ${objects.length} documents in '${alias}'`
    );

    return moveAlias(client, newIndex, alias);
  });

  try {
    await Promise.all(jobs);
    setStatus(activity, `done`);
  } catch (err) {
    report.panic(`failed to index to ElasticSearch`, err);
  }

  activity.end();
};

/**
 * moves the alias to the target index, delete previously aliased index
 *
 * @param client
 * @param targetIndex
 * @param alias
 */
async function moveAlias(client, targetIndex, alias) {
  try {
    const response = await client.indices.getAlias({ name: alias });
    await Promise.all(
      Object.entries(response.body).map(async ([aliasedIndex]) => {
        setStatus(activity, `deleting index '${aliasedIndex}'`);
		return client.indices.delete({ index: aliasedIndex });
      })
    );
  } catch (error) {
    // No existing alias found
  }

  await client.indices.putAlias({ index: targetIndex, name: alias });
  setStatus(activity, `moved alias '${alias}' -> '${targetIndex}'`);
}

/**
 * get indices starting with basename
 *
 * @param client
 * @param basename
 */
async function getIndicesStartingWith(client, basename) {
  let indices = [];

  try {
    const response = await client.cat.indices({ h: ['index'] });
    indices = response.body
      .split('\n')
      .filter((index) => index.startsWith(basename));
  } catch (err) {
    // No indices found
  }

  return indices;
}

/**
 * returns a unique index name
 *
 * @param client
 * @param index
 */
async function getUniqueIndexName(client, basename) {
  const indices = await getIndicesStartingWith(client, `${basename}_`);

  const max_suffix = indices.reduce((acc, indexName) => {
    const parts = indexName.split('_');
    const current_index = Number(parts[parts.length - 1]);

    return Math.max(acc, current_index);
  }, 0);

  indices.length &&
    setStatus(activity, `indices [${indices.join()}]  already exists`);

  return `${basename}_${max_suffix + 1}`;
}

/**
 * delete indices not linked to an alias
 *
 * @param client
 * @param index
 */
async function deleteOrphanIndices(client, index) {
  let response;
  try {
    const indices = await getIndicesStartingWith(client, `${index}_`);
    try {
      response = await client.indices.getAlias({ name: index });
      const aliasedIndices = Object.keys(response.body);
      indices.map(async (index) => {
        if (!aliasedIndices.includes(index)) {
          await client.indices.delete({ index: index });
		  setStatus(activity, `deleting index '${index}'`);
        }
      });
    } catch (err) {
      // No aliased index found
	  setStatus(activity, err);
    }
  } catch (err) {
    // No existing indices found
	setStatus(activity, err);
  }
  setStatus(activity, `no otphan index found`);
}

/**
 * creates a new index
 *
 * @param client
 * @param index
 */
async function createIndex(client, index) {
  const createConfig = {
    index: index,
  };
  await client.indices.create(createConfig);
  setStatus(activity, `index '${index}' created`);
}

/**
 * apply settings and mappings to the index if any
 *
 * @param client
 * @param index
 */
async function setSettings(client, index) {
	
    await client.indices.close({
      index: index,
    });
	setStatus(activity, `set settings`);
    await client.indices.putSettings({
      index: index,
       body: {
		  settings:  {
				index: {
					number_of_replicas:0
				}
			}
		}
	});
    await client.indices.open({
      index: index,
    });
	/*if (mappings) {
		setStatus(activity, `set mapping '${mapping}'`);
		const response = await client.indices.putMapping({
			index: index,
			body: { ...mappings }
		});
		
		setStatus(activity, response);
	}*/
}

/**
 * hotfix the Gatsby reporter to allow setting status (not supported everywhere)
 *
 * @param {Object} activity reporter
 * @param {String} status status to report
 */
function setStatus(activity, status) {
  if (activity && activity.setStatus) {
    activity.setStatus(status);
  } 
  console.log('ElasticSearch:', status);
}
