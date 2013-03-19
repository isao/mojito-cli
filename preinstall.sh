#!/bin/sh

echo 'mojito-cli: Preparing to install package "mojito-cli".'
npm=$(which npm ynpm | grep ^/ | head -1)
global_lib=$($npm prefix -g)/lib/node_modules

if [[ -d $global_lib/mojito ]]
then
    cat <<FOO >&2
mojito-cli: A prior global installation of package "mojito" was found.
mojito-cli: It will be removed since they share the command name "mojito".
mojito-cli: Note that this won't affect your usage of the "mojito" command
mojito-cli: from the command line.

FOO
    $npm rm -sg mojito
fi
