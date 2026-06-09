/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_2605467279")

  // add field
  collection.fields.addAt(1, new Field({
    "cascadeDelete": false,
    "collectionId": "pbc_728114816",
    "help": "",
    "hidden": false,
    "id": "relation2324571881",
    "maxSelect": 0,
    "minSelect": 0,
    "name": "conversation",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "relation"
  }))

  // add field
  collection.fields.addAt(2, new Field({
    "help": "",
    "hidden": false,
    "id": "select1466534506",
    "maxSelect": 0,
    "name": "role",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "select",
    "values": [
      "user",
      "agent"
    ]
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_2605467279")

  // remove field
  collection.fields.removeById("relation2324571881")

  // remove field
  collection.fields.removeById("select1466534506")

  return app.save(collection)
})
