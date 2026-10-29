
#define MyAppName "Inventario Tienda"
#define MyAppVersion "1.0.0"
#define MyAppPublisher "Inventario Tienda"

[Setup]
AppId={{B27C86D1-9F12-4B57-AE38-62B891DDA3F1}
AppName={#MyAppName}
AppVersion={#MyAppVersion}
AppPublisher={#MyAppPublisher}
DefaultDirName=C:\InventarioTienda
DefaultGroupName={#MyAppName}
DisableProgramGroupPage=yes
PrivilegesRequired=admin
OutputDir=instalador-salida
OutputBaseFilename=Instalador-Inventario-Tienda
Compression=lzma2
SolidCompression=yes
WizardStyle=modern
CloseApplications=yes
RestartApplications=no

[Languages]
Name: "spanish"; MessagesFile: "compiler:Languages\Spanish.isl"

[Dirs]
Name: "{app}"
Name: "{app}\backend"
Name: "{app}\frontend"
Name: "{app}\scripts"

[Files]
Source: "dist-instalador\backend\*"; DestDir: "{app}\backend"; Excludes: ".env"; Flags: ignoreversion recursesubdirs createallsubdirs
Source: "dist-instalador\frontend\*"; DestDir: "{app}\frontend"; Flags: ignoreversion recursesubdirs createallsubdirs
Source: "dist-instalador\scripts\*"; DestDir: "{app}\scripts"; Flags: ignoreversion recursesubdirs createallsubdirs

[Run]
Filename: "{sys}\WindowsPowerShell\v1.0\powershell.exe"; Parameters: "-NoExit -ExecutionPolicy Bypass -File ""{app}\scripts\preparar-instalacion.ps1"""; Description: "Configurar PostgreSQL y crear el administrador"; Flags: postinstall skipifsilent nowait; Check: EsPrimeraInstalacion

[Icons]
Name: "{group}\Inventario Tienda"; Filename: "{sys}\WindowsPowerShell\v1.0\powershell.exe"; Parameters: "-ExecutionPolicy Bypass -File ""{app}\scripts\iniciar-inventario.ps1"""; WorkingDir: "{app}\scripts"
Name: "{commondesktop}\Inventario Tienda"; Filename: "{sys}\WindowsPowerShell\v1.0\powershell.exe"; Parameters: "-ExecutionPolicy Bypass -File ""{app}\scripts\iniciar-inventario.ps1"""; WorkingDir: "{app}\scripts"

[Code]
function EsPrimeraInstalacion: Boolean;
begin
  Result := not FileExists(ExpandConstant('{app}\backend\.env'));
end;
