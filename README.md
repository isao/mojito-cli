mojito-cli [![Build Status](https://travis-ci.org/isao/mojito-cli.png)](https://travis-ci.org/isao/mojito-cli)
==========

Goals

1. Move command line tools out of mojito.
1. [x] create a simple cli runner to install globally as command named "mojito"
    - prevent mojito core from being installed globally afterwards, or warn if `npm i mojito-cli -g` after `npm i mojito -g`
1. [ ] prepare mojito for external cli
    - [x] allow legacy commands to be invoked programatically
    - [ ] deprecation, support
    - [ ] remove "mojito" executable symlinking in global or local /bin/
    - [ ] remove commands that are replaced
1. implement new commands as npm packages
1. <strike>shared/user configs for commands</strike> use --config?
1. new 'create' command, with better external archetype support
