#!/usr/bin/env bash

if [ "`which standard`" = "" ]
then
    npm install standard -g
fi

if [ "`which snazzy`" = "" ]
then
    npm install snazzy -g
fi

echo '#!/usr/bin/env bash

FILES=`git diff --name-only --cached --relative | grep "\.jsx\?$"`

standard $FILES --fix --verbose | snazzy
if [ $? -ne 0 ]; then exit 1; fi

for FILE in $FILES; do
  git add $FILE
done
' > .git/hooks/pre-commit

chmod +x .git/hooks/pre-commit
