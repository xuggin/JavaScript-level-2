



const regexp = /^'|(\s)'|'(\s)|'$/g; 

str.replace(regexp, '+$1+');      
