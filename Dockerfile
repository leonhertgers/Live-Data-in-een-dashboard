FROM httpd:2.4
COPY *.js /usr/local/apache2/htdocs/
COPY Terugmelddata_HTML.html /usr/local/apache2/htdocs/index.html
