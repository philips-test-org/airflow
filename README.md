# README

This repository serves as a starting point for Rails Apps on the AI Platform.

For information on developing on the AI Platform, see the AI [developer documentation](https://developer-docs.analytical.info/).

This repository also includes a renaming helper script to aide in setting the name of your application.

rename.rb usage:

`ruby rename.rb 'New Name'`

The application name is used in the following files

* `app/controllers/application_controller.rb` as 'new-name'
* `config/application.name` as 'new-name'
* `db_scripts/create-glassfish-jdbc.sh` as 'newname'
* `db_scripts/create.sql` as 'newname'
* `db_scripts/install.sh` as 'newname'
* `db_scripts/schema.sql` as 'newname'
* `config/initializers/session_store.rb` as 'newname'
* `config/database.yml` as 'newname'
* `config/application.rb` as 'NewName'
* `app/views/layouts/application.html.erb` as 'New Name'
