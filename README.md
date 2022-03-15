# Local builden und editieren

- Github Account und einen Personal Access Token mit repo Rechten und keinem Expiration-Date erstellen(beim erstellen lokal kopieren, wird nur einmal angezeigt;  https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token)
- Freigabe für das https://github.com/rmdatatechnology/static_web_app_docu und https://github.com/rmdatatechnology/documentation Repository.
	- Hierfür den Usernamen an uns schicken und wir erteilen die benötigten Rechte.

## Benötigte Tools

- Git (https://git-scm.com/) 
- TortioseGit (https://tortoisegit.org/) oder anderen Git Client (e.g. SourceTree)
- Node.js (=> https://github.com/microsoft/nodejs-guidelines/blob/master/windows-environment.md)

## Repository clonen und ausführen

- Repository clonen
- Submodule Updaten (TortioseGit -> Submodule Update)
- Eingabeaufforderung über "Ausführen" öffnen (cmd) 
- In den Ordner in dem das Rositosy liegt wechseln
- "npm install" ausführen
- "npm run develop" ausführen und offen lassen
- Im Browser http://localhost:8000/ öffnen
- Mit "npm run clean" kann man den Build wieder löschen.