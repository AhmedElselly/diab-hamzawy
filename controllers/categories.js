const Category = require('../models/category');
const slugify = require('slugify');

module.exports = {
	async categoryForm(req, res){
		res.render('categories/new');
	},


	async manage(req, res){
		const categories = await Category.find();
		let categoryList;
		if(categories){
			categoryList = await createCategories(categories);
		}
		console.log(categoryList)

		res.render('categories/manage', {categoryList});
	},

	async create(req, res){
		const categoryObj = {
			name: req.body.name,
			slug: slugify(req.body.name)
		};
		
		if(req.body.parentId){
			categoryObj.parentId = req.body.parentId;
		}

		const category = await new Category(categoryObj);
		await category.save();
		res.redirect('/categories/manage');
	},

	async categoryIndex(req, res){
		const categories = await Category.find();
		if(!categories){
			return res.status(400).json({error: 'No categories at found!'});
		}
		let categoryList;
		if (categories) {
			categoryList = createCategories(categories);
		}

		return res.json(categoryList);
	},

	async categoryEdit(req, res){

	}
}


function createCategories(categories, parentId = null){
	const categoryList = [];
	let category;
	if(parentId === null){
		category = categories.filter(cat => cat.parentId == undefined);
	} else {
		category = categories.filter(cat => cat.parentId == parentId);
	}

	for(let cate of category){
		categoryList.push({
			_id: cate._id,
			name: cate.name,
			slug: cate.slug,
			parentId: cate.parentId,
			children: createCategories(categories, cate._id),
		})
	}

	return categoryList;
}