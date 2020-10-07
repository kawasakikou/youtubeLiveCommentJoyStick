
sudo apt update 
sudo apt upgrade -y
sudo apt install -y nodejs npm
sudo npm install --global yarn
echo 'export PATH="$PATH:`yarn global bin`"' > .bashrc
source .bashrc
yarn
