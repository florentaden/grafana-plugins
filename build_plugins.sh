# compile all plugins under input directory name ("plugins" for example above),
# then move the compiled outputs to "plugins/dist", each plugin a directory

cd plugins
rm -rf dist

# loop thru all plugsin directory to do package merge first
packages=()
for f in * ; do
  if [ -d "$f" ]; then
    if [ -f "$f/package.json" ]; then
        packages+=("$f/package.json")
    fi
  fi
done

# generate a one for all package.json
package-json-merge $packages > package.json
# install node_modules at plugins' parent dir
yarn install

for f in * ; do
    echo $f
    if [ $f = "node_modules" ]; then
      continue
    fi
    if [ -d "$f" ]; then
      	cd $f
        rm -rf ./dist # tidy up leftovers from developer's local directory
        ln -s ../node_modules . # symboli link parent dir's node_modules here
        yarn build
        if [ -d "./dist/" ]; then
          id=`cat src/plugin.json | jq -r .id`
          echo $id
          rm -rf $id
          if [ ! -d ../dist ]; then mkdir ../dist; fi
          # move the compile "dist" to up level "dist/plugin-id"
          mv ./dist ../dist/$id
        fi
        cd ..
    fi
done
cd ..
