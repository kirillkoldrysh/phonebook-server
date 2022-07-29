const mongoose = require('mongoose');

if (process.argv.length < 2) {
  console.log('please provide the password as an argument: node mongo.js <password> <other-args>');
  process.exit(1);
}

const password = process.argv[2];

const url = `mongodb+srv://BadKoldrysh:${password}@phonebook.fgljqjr.mongodb.net/phonebook?retryWrites=true&w=majority`;

const personSchema = new mongoose.Schema({
  name: String,
  type: String,
  number: String,
});

const Person = mongoose.model('Person', personSchema);

const command = process.argv[3];
if (process.argv.length === 3) {
  mongoose
  .connect(url)
  .then(result => {
    Person.find({})
      .then(result => {
        console.log('phonebook');
        result.forEach(person => console.log(`${person.name} ${person.type} ${person.number}`));
        mongoose.connection.close();
      });
    })
  .catch(error => console.log(error));
} else if (command === 'find') {
  const personName = process.argv[4];

  mongoose
  .connect(url)
  .then(result => {
    Person.findOne({ name: personName })
      .then(person => {
        if (person === null) {
          console.log('person doesnt exist in the phonebook');
        } else {
          console.log(person);
        }
        mongoose.connection.close();
      });
    })
  .catch(error => console.log(error));
} else if (command === 'delete') {
  const personName = process.argv[4];

  mongoose
  .connect(url)
  .then(result => {
    Person.deleteOne({ name: personName })
      .then(result => {
        if (result.deletedCount > 0) {
          console.log(`entry ${personName} has been successfully deleted from the phonebook`);
        } else {
          console.log(`entry with name ${personName} doesnt exist`);
        }
        mongoose.connection.close();
      });
  })
  .catch(error => console.log(error));
} else {
  const personName = process.argv[3];
  const number = process.argv[4];
  const type = process.argv[5];

  mongoose
    .connect(url)
    .then(result => {
      console.log('connected');

      const person = new Person({
        name: personName,
        number: number,
        type: type !== undefined ? type : 'unknown',
      });

      return person.save();
    })
    .then(result => {
      console.log(`added ${personName} number ${number} type ${type} to phonebook`);
      return mongoose.connection.close();
    })
    .catch(error => console.log(error));
}
