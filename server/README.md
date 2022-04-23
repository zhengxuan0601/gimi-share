# First connect mysql
mysql -u root - p
EnterPassword: *******
ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'password';

# Install dependencies
npm install

# Run the server locally
npm run start
