module.exports = {
	isAuth(req, res, next){
		if(req.isAuthenticated()){
			next();
		} else {
			throw new Error('User is not authenticated!');
		}
	},

	isAdmin(req, res, next){
		if(req.user.admin === true){
			next();
		} else {
			throw new Error('User is not authorized!');
		}
	},

	search(req, res, next){
		const queryKeys = Object.keys(req.query);
		if(queryKeys.length){
			const dbQueries = [];
			let {search, price, avgRating} = req.query;
			if(search){
				search = new RegExp(escapeRegExp(search), 'gi');
				dbQueries.push({
					$or: [
						{title: search},
						{body: search},
						{category: search},
					]
				})
			}

			if(price){
				if(price.min){
					dbQueries.push({price: {$gte: price.min}});
				}
				if(price.max){
					dbQueries.push({price: {$lte: price.max}});
				}
			}

			if(avgRating){
				dbQueries.push({avgRating: {$in: avgRating}});
			}

			res.locals.dbQuery = dbQueries.length ? {$and: dbQueries} : {};
		}
		res.locals.query = req.query;
		queryKeys.splice(queryKeys.indexOf('page'), 1);
		const delimiter = queryKeys.length ? '&' : '?';
		res.locals.paginateUrl = req.originalUrl.replace(/(\?|\&)page=\d+/g, '') + `${delimiter}page=`;
		next();
	}
}

function escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
}