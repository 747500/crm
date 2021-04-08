# crm

- the project is under development - arbitrary commit may not work;
- the goal is backend, frontend on the second place;
- code in all branches of this repo is experimental, not testing/stable/etc;
- Frontend/interface is in Russian and there is no translation and i18n yet.

Prereq:

- server/config.js (from server/example-config.js)
- https://github.com/747500/crm-backend-rabbitmq-graphql-mongodb
- https://github.com/747500/crm-backend-rabbitmq-telegram
- RabbitMQ
- MongoDB
- Sphinx with rtindex:
```
# ...
index testrt
{
    type = rt
    rt_mem_limit = 128M

    path = /var/lib/sphinx/testrt

    rt_field = content
    rt_attr_string = user
    rt_attr_string = oid
    rt_attr_string = kind

    min_infix_len = 2

    morphology = stem_enru, Soundex, Metaphone
    expand_keywords = 1

    min_word_len = 3
}
# ...
```


$ npm install

$ npm run build

$ npm run serve

open http://127.0.0.1:3000/
