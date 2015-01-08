module.exports = function Route(app){
	var users = [];
	app.get('/', function(req, res){
		res.render('index', {title: 'Home Page'});
	});
	app.io.route('ready', function(req){
		req.io.emit('existing_users', {users: users});
	})
	app.io.route('got_a_new_user', function(req){
		console.log(req.data.room);
		req.io.join(req.data.room);
		req.io.room(req.data.room).broadcast('announce', { message: 'New client in the chat room: ' + req.data });
		console.log(req.data.name);
		users.push({name: req.data.name, sessionID: req.sessionID});
		console.log(users);
		req.io.emit('new_user', {new_user_name: req.data.name, sessionID: req.sessionID});
		req.io.broadcast('new_user', {new_user_name: req.data.name, sessionID: req.sessionID});
		
		// console.log(users);
	})

	app.io.route('updated_text', function(req){
		req.io.broadcast('new_message', { text: req.data.text, sessionID: req.sessionID})
	})
}