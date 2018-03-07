const fs = require('fs');
const flag = process.argv[2];
const title = process.argv[3];
const content = process.argv[4];
let index = 0;
const notes = [];
switch(flag) {
  case 'create':
    createNotes(title, content, (error) => {
      if(error) {
        return console.log('Увы что-то пошло не так при чтении файла');
      }
      console.log('Заметка успешно создана');
    });
    break;
  case 'list':
    watchListNotes((error, notes) => {
      if(error) return console.log(`Увы что-то пошло не так при просмотре файла : ${error.messsage}`);
      notes.forEach((value,i) => console.log(`${++i}. ${value.title}`));
    });
    break;
  case 'view':
    viewNote(title,(error, note) => {
      if(error) return console.log(`Увы что-то пошло не так при просмотре заметки :\n ${error.message}`);
      console.log(`# ${note.title}\r\n\r\n---\r\n\r\n`);
      return console.log(`${note.content}`);
    });
    break;
  case 'remove':
    removeNote(title, (error, notes)=> {
      if(error) {
        return console.log('Увы что-то пошло не так при чтении файла');
      }
      console.log('Заметка успешно удалена');
    });
    break;
  default:
    console.log('Неизвестная мне команда,печаль =(')
}
function viewNote(title, done) {
  fs.readFile('notes.json', 'utf-8', (error, data) => {
    if(error) return done(error);
    let note = null;
    JSON.parse(data).forEach((value) => {
      if(value.title === title.toString()) {
        return note = value;
      }
    });
    if(!note) {
      return console.log("Заметка не найдена");
    }
    done(null, note);
  });
}
function  watchListNotes(done){
  fs.readFile('notes.json', 'utf-8', (error, data) => {
    if(error) return done(error);
    const notes = JSON.parse(data);
    done(null, notes);
  });
}
function createNotes(title, content, done){
  fs.readFile('notes.json', 'utf-8', (error, data) => {
    if(error) return done(error);
    if(!title) {
      return console.log("Заметка не задана");
    }
    if(!content) {
      return console.log("Описание заметки не задано");
    }
    const notes = JSON.parse(data);
    notes.push({title: title, content: content});
    const notesJSON = JSON.stringify(notes);
    fs.writeFile('notes.json',notesJSON, 'utf-8', (error) => {
      if(error) console.log('Увы что-то пошло не так при записи файла');
    })
    done();
  });
}
function removeNote(title, done) {
  fs.readFile('notes.json', 'utf-8', (error, data) => {
    if(error) return done(error);
    const notes = JSON.parse(data);
    const filterNotes = notes.filter(value => value.title !== title);
    if(filterNotes.length === notes.length) {
      return console.log('Такой заметки не найдено')
    }
    const notesJSON = JSON.stringify(filterNotes);
    fs.writeFile('notes.json',notesJSON, 'utf-8', (error) => {
      if(error) console.log('Увы что-то пошло не так при записи файла');
    })
    done();
  });
}
