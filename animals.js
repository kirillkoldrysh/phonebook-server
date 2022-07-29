const mongoose = require('mongoose');

if (process.argv.length < 2) {
  console.log('please provide the password as an argument: node animals.js <password> <other-args>');
  process.exit(1);
}

const password = process.argv[2];

const url = `mongodb+srv://BadKoldrysh:${password}@phonebook.fgljqjr.mongodb.net/phonebook?retryWrites=true&w=majority`;

const animalSchema = new mongoose.Schema({
  name: String,
  type: String,
});

const Animal = mongoose.model('Animal', animalSchema);

const db = () => {
  const connect = mongoose.connect(url);

  const _add = ({ data }) => {
    connect
      .then(result => {
        const animal = new Animal(data);

        return animal.save();
      })
      .then(result => {
        console.log('added a new animal');
        _showAll();
        return mongoose.connection.close();
      })
      .catch(error => console.log(error));
  };

  const _showAll = () => {
    connect
      .then(result => {
        Animal.find({})
          .then(result => {
            console.log('animals');
            result.forEach(animal => console.log(`${animal.name} ${animal.type}`));
            mongoose.connection.close();
          });
      })
      .catch(error => console.log(error));
  }

  return {
    add: _add,
    showAll: _showAll,
  };
};

if (process.argv.length === 4) {
  db().showAll();
} else {
  db().add({data: {name: process.argv[3], type: process.argv[4]}});
}
