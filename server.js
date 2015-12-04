// require express and other modules
var express = require('express'),
    app = express(),
    bodyParser = require('body-parser');

// configure bodyParser (for receiving form data)
app.use(bodyParser.urlencoded({ extended: true }));

// serve static files from public folder
app.use(express.static(__dirname + '/public'));

/************
 * DATABASE *
 ************/

// our database is an array for now with some hardcoded values
var todos = [
  { _id: 1, task: 'Laundry', description: 'Wash clothes' },
  { _id: 2, task: 'Grocery Shopping', description: 'Buy dinner for this week' },
  { _id: 3, task: 'Homework', description: 'Make this app super awesome!' }
];

/**********
 * ROUTES *
 **********/

/*
 * HTML Endpoints
 */

app.get('/', function homepage (req, res) {
  res.sendFile(__dirname + '/views/index.html');
});


/*
 * JSON API Endpoints
 */

app.get('/api/todos', function index(req, res) {
	res.json({todos: todos});
});

app.get('/api/todos/:id', function show(req, res) {
	var todoId = parseInt(req.params.id);
	todos.forEach(function(todo){
		// console.log(todo._id);
		if(todoId === todo._id){
			res.send(todo);
		}
	});
});

app.post('/api/todos', function create(req, res) {
	var newTodo = req.body;
	if (todos.length > 0){
		newTodo._id = todos[todos.length - 1]._id + 1;
	} else {
		newTodo._id = 1;
	}
	todos.push(newTodo);
	res.json(newTodo);
});

app.delete('/api/todos/:id', function destroy(req, res) {
	var id = parseInt(req.params.id);
	var deleted;
	todos.forEach(function(todo, index){
		if(id === todo._id){
			deleted = todos.indexOf(todo);
		}
	});
	var newList = todos.splice(deleted, 1);
	res.json(newList);
});

app.put('/api/todos/:id', function update(req, res) {
	var thisTodo = req.body;
	var thisId = parseInt(req.params.id);
	todos.forEach(function(todo, index){
		if(thisId === todo._id){
			todos.splice(index, 1, {_id: todo._id, task: thisTodo.task, description: thisTodo.description});
			res.json(todos[index]);
		}
	});
	// var newtask = req.body.task;
	// var newdescription = req.body.description;
	// var updateTodo = { _id: thisId, task: newtask, description: newdescription};
	// res.json(updateTodo);
});

app.get('/api/todos/search', function search(req, res){});


/**********
 * SERVER *
 **********/

// listen on port 3000
app.listen(3000, function() {
  console.log('check out localhost3000, bro');
});
