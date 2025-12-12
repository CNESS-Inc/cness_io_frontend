const fs = require('fs');

// Read the file
const content = fs.readFileSync('src/Common/ServerAPI.tsx', 'utf8');

// Find the pattern and insert the new endpoint
const pattern = /(basic_info_search_location: "\/directory-basic-info\/search-location",\s*)(state: "\/state",)/;
const replacement = '$1  basic_info_get_by_services: "/directory-basic-info/get-by-services",\n  $2';

// Perform the replacement
const modifiedContent = content.replace(pattern, replacement);

// Write the file back
fs.writeFileSync('src/Common/ServerAPI.tsx', modifiedContent, 'utf8');

console.log("Endpoint added successfully!");