class Cart{
	constructor(oldItems){
		this.items = oldItems.items || {};
		this.totalQty = oldItems.totalQty || 0;
		this.totalPrice = oldItems.totalPrice || 0;
	}

	addItem(itemId, item){
		var existingItem = this.items[itemId]
		console.log(item)
		if(!existingItem){
			existingItem = this.items[itemId] = {item, qty: 0, price: 0};
		}
		existingItem.qty++
		existingItem.price = existingItem.qty * item.price;
		// let total = existingItem.qty * existingItem.price;
		this.totalPrice += existingItem.item.price;
		this.totalQty++
	}

	generateArray(){
		let result = [];
		for(var id in this.items){
			result.push(this.items[id]);
		}

		return result;
	}

	add(itemId){
		console.log(itemId)
		console.log(this.items[itemId])
		this.items[itemId].qty++;
		this.items[itemId].price+=this.items[itemId].item.price;
		this.totalQty++;
		this.totalPrice += this.items[itemId].item.price;
		console.log(this.totalPrice, this.totalQty)
	}

	reduce(itemId){
		console.log(itemId)
		console.log(this.items[itemId])
		this.items[itemId].qty--;
		this.items[itemId].price-=this.items[itemId].item.price;
		this.totalQty--;
		this.totalPrice -= this.items[itemId].item.price;
		console.log(this.totalPrice, this.totalQty)
		if(this.items[itemId].qty <= 0){
			delete this.items[itemId];
		}
	}
}


module.exports = Cart;