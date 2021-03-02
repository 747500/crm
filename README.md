# crm

Prereq:

- server/config.js (from server/config.js.example)
- MongoDB
- Sphinx with rtindex:
```
# ...
index testrt
{
    type            = rt
    rt_mem_limit        = 128M

    path            = /var/lib/sphinx/testrt

    rt_field        = content
    rt_attr_string      = user
    rt_attr_string      = oid
    rt_attr_string      = kind

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
