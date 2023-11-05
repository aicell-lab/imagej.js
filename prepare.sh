rm -rf lib/ImageJ
wget https://wsr.imagej.net/distros/cross-platform/ij153.zip
# extract the zip file and save it to the lib folder
unzip ij153.zip -d lib
# remove the zip file
rm ij153.zip

# Download plugins
# Read the plugins_manifest.txt file line by line
while IFS=: read -r filename url; do
  # Download and place the file under plugins
  curl -L "$url" -o "lib/ImageJ/plugins/$filename"
done < plugins_manifest.txt

# Now let's create index.list files for each subfolders under lib/ImageJ/{plugins,luts,macros} recursively, the file shouldcontains the list of file names
# Path: prepare.sh
# Directories to process
dirs=("lib/ImageJ/plugins" "lib/ImageJ/luts" "lib/ImageJ/macros")

# Loop through each directory
for dir in "${dirs[@]}"; do
  # Check if directory exists
  if [[ -d "$dir" ]]; then
    # Find all child directories and create index.list for each
    find "$dir" -type d | while read -r child_dir; do
      # Generate index.list containing the list of file names
      ls "$child_dir" | grep -v "^index\.list$" > "$child_dir/index.list"
    done
  else
    echo "Directory $dir does not exist."
  fi
done