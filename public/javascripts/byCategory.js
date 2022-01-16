const url = 'http://localhost:3000';
// const categoriesUrl = 'http://localhost:3000/posts/categories';
async function getCategories(url){
	const res = await axios.get(`${url}/posts/categories`);
	console.log(res.data)
	res.data.map(text => {
		let li = document.createElement('li');
		let link = document.createElement('a');
		link.innerText = text;
		li.classList.add('nav-item');
		link.classList.add('nav-link');
		link.style.cursor = 'pointer';
		
		li.append(link);
		const ul = document.querySelector('#categories');
		ul.append(li);	

		link.addEventListener('click', function(e){
			console.log(this.innerText)
			let text = this.innerText;
			// text.classList.add('active')
			postsByCategory(url, text, this);
		});
	})
	
	// return res;
}



async function postsByCategory(url, category, link){
	link.setAttribute('href', `${url}/posts/categories/${category}`);
	const res = await axios.get(`${url}/posts/categories/${category}`);
	console.log(res.data)
}

getCategories(url)
// postsByCategory(categoriesUrl)