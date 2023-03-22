{ pkgs ? import (fetchTarball "https://github.com/NixOS/nixpkgs/archive/ee01de29d2f58d56b1be4ae24c24bd91c5380cea.tar.gz") {} }:

with pkgs;
let
  inherit (lib) optional optionals;
in
 pkgs.mkShell {
    # nativeBuildInputs is usually what you want -- tools you need to run
    # elixir v1.12.3
    # postgres 13.4
    nativeBuildInputs = [ pkgs.nodejs pkgs.nodePackages.typescript pkgs.nodePackages.typescript-language-server ]
    ++ optional stdenv.isLinux inotify-tools # For file_system on Linux.
    ++ optionals stdenv.isDarwin (with darwin.apple_sdk.frameworks; [
      # For file_system on macOS.
      CoreFoundation
      CoreServices
    ]);
      # Put the PostgreSQL databases in the project diretory.
      shellHook = ''
      export PGDATA="$PWD/.db"
    '';
}
