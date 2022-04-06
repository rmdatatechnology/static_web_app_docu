# Local builden und editieren

- Github Account und einen Personal Access Token mit repo Rechten und keinem Expiration-Date erstellen(beim erstellen lokal kopieren, wird nur einmal angezeigt;  https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token)
- Freigabe für das https://github.com/rmdatatechnology/static_web_app_docu und https://github.com/rmdatatechnology/documentation Repository.
	- Hierfür den Usernamen an uns schicken und wir erteilen die benötigten Rechte.

## Benötigte Tools

- Git (https://git-scm.com/) 
- TortioseGit (https://tortoisegit.org/) oder anderen Git Client (e.g. SourceTree)
- Node.js (=> https://github.com/microsoft/nodejs-guidelines/blob/master/windows-environment.md)
	- Auf der Seite 4 => Tools for Native Modules das Häckchen setzen damit alle notwendigen Tools mit installiert werden.

## Repository clonen und ausführen

- Repository clonen
- Submodule Updaten
	- TortioseGit -> Submodule Update
		- Initialize submodules
		- Recursive
- Submodule auschecken
	- In den Dokumentation ordner wechseln
	- TortioseGit -> Switch/Checkout
		- Branch -> remotes/origin/main
		- Optionen:
			- Track
			- alles andere deselektieren
- Eingabeaufforderung über "Ausführen" öffnen (cmd) 
- In den Ordner in dem das Rositosy liegt wechseln
- "npm install" ausführen
- "npm run develop" ausführen und offen lassen
- Im Browser http://localhost:8000/ öffnen
- Mit "npm run clean" kann man den Build wieder löschen.


**Hinweis**

Immer wenn die Fehlermeldung Detached Head beim einchecken des Submodules erscheint, bitte überprüfen ob das richtige repo ausgechecht ist. Sonst den Ponkt Submodule auschecken wiederholen.