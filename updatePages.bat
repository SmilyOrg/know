mkdir bin-transfer
git checkout master
cp -r bin/* bin-transfer/
git checkout gh-pages
cp -r bin-transfer/* bin/
rm -r bin-transfer/
git add bin/
git commit -m "merged bin from master"
git checkout master