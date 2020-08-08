import app from 'firebase/app';
import 'firebase/auth';
import 'firebase/firebase-firestore';

var firebaseConfig = {
  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: process.env.REACT_APP_AUTH_DOMAIN,
  databaseURL: process.env.REACT_APP_DATABASE_URL,
  projectId: process.env.REACT_APP_PROJECT_ID,
  storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID
};

class Firebase {
	constructor() {
		app.initializeApp(firebaseConfig); //initialize configurations
		this.auth = app.auth();
	}

	async login(email, password) {
		await this.auth.signInWithEmailAndPassword(email, password)
		.then((user) => {
			localStorage.setItem('userid', user.user.uid);
			localStorage.setItem('name', user.user.displayName);
		})
		.catch((err) => console.log(err));
	}

	async logout() {
		await this.auth.signOut()
		.then(() => {
			localStorage.removeItem('userid');
			localStorage.removeItem('name');
		}) //on success remove name from local storage
		.catch((err) => console.log(err));
	}

	async register(name, email, password) {

		await this.auth.createUserWithEmailAndPassword(email, password)
		.then(async (user) => {
			try {

				await this.auth.currentUser.updateProfile({
					displayName: name
				}); //changes the display name

			} catch(err) {
				console.log(err)
			}
			localStorage.setItem('userid', user.user.uid);
			localStorage.setItem('name', user.user.displayName);
		})
		
	}

	createTodo(title) {
		this.auth.onAuthStateChanged(function(user) {
		  if (user) {

		    app.firestore().collection("Todolist").add({
		    	completed : false,
			    uid : user.uid,
			    title : title
			})
			.then(() => console.log("Document successfully added"))
			.catch((err) => console.log(err));

		  } else {
		    console.log('not logged in');
		  }

		});
	}// creates an item within the todolist

	getTodo() {
		return app.firestore().collection("Todolist").get()
		.then((data) => {
			return data.docs.map(doc => ({ ...doc.data(), id: doc.id }));

		})
		.catch((err) => console.log(err));

		
	}// gets todolist

	strikeTodo(id, completed, uid, title) {
		app.firestore().collection("Todolist").doc(id).set({completed : completed, uid : uid, title : title});
	}//updates todolist

	deleteTodo(id) {
		app.firestore().collection("Todolist").doc(id).delete();
	}//deletes todolist item
}


export default new Firebase()