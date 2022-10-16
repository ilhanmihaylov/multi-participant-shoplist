var express = require('express');
var router = express.Router();
const Shop = require('../models/shop');
const Participant = require('../models/participant');
const Product = require('../models/product');
const mongoose = require('mongoose');

router.get('/:shopid/:participantid', async function (req, res, next) {

	if (!mongoose.isValidObjectId(req.params.shopid) || !mongoose.isValidObjectId(req.params.participantid))
		return res.render('index');

	var shop = await Shop.findById(req.params.shopid.toString()).exec();
	if (!shop)
		return res.render('index');

	var participant = await Participant.findOne({ shop_id: shop._id.toString(), _id: req.params.participantid })

	if (!participant)
		return res.render('index');


	var products = await Product.find({ shop_id: shop._id.toString() });
	products.sort((a, b) => a.complete - b.complete)

	return res.render('index2', { shop_name: shop.title, participant_name: participant.name, products: products })
});


router.get('/:shopid/:participantid/add_product/:productname', async function (req, res, next) {

	if (!mongoose.isValidObjectId(req.params.shopid) || !mongoose.isValidObjectId(req.params.participantid))
		return res.render('index');

	if (!req.params.productname)
		return res.render('index');

	var shop = await Shop.findById(req.params.shopid.toString()).exec();
	if (!shop)
		return res.render('index');

	var participant = await Participant.findOne({ shop_id: shop._id.toString(), _id: req.params.participantid })

	if (!participant)
		return res.render('index');

	var product = new Product();
	product.shop_id = shop._id.toString();
	product.participant_id = participant._id.toString();
	product.name = req.params.productname.trim();
	product.you_buy_initiator_id = ' ';
	product.save();

	var io = req.app.get('io');
	io.to(shop._id.toString()).emit("update", "reload");

	return res.json(product);
});

router.get('/admin/:admincode/add_participant/:shopid/:participantname', async function (req, res, next) {
	if(req.params.admincode != req.app.get('admin_code')) return res.sendStatus(401)
	var p = new Participant({name: req.params.participantname, shop_id: req.params.shopid});
	p.save();
	result = {};
	result['url'] = `${req.hostname}/shop/${req.params.shopid}/${p._id}`;
	result['participant_id'] = p.id;
	result['success'] = true;
	return res.json(result);
});

router.get('/admin/:admincode/add_shop/:shopname', async function (req, res, next) {
	console.log(req.app.get('admin_code'));
	if(req.params.admincode != req.app.get('admin_code')) return res.sendStatus(401)
	var shop = new Shop({title: req.params.shopname});
	shop.save();
	return res.json(shop);
});

router.get('/:shopid/:participantid/:action/:productid', async function (req, res, next) {

	if (!mongoose.isValidObjectId(req.params.shopid) || !mongoose.isValidObjectId(req.params.participantid) || !mongoose.isValidObjectId(req.params.productid))
		return res.render('index');

	if (!req.params.productid || !req.params.action)
		return res.render('index');

	var shop = await Shop.findById(req.params.shopid.toString()).exec();
	if (!shop)
		return res.render('index');

	var participant = await Participant.findOne({ shop_id: shop._id.toString(), _id: req.params.participantid })

	if (!participant)
		return res.render('index');

	var product = await Product.findById(req.params.productid).exec();
	if (!product)
		return res.json(product);

	if (req.params.action == 'cart') {
		product.complete = !product.complete;
		product.you_buy = false;
		product.save();
	}
	if (req.params.action == 'you-buy') {
		product.you_buy = !product.you_buy;
		product.you_buy_initiator_id = participant.name;
		product.save();
	}
	if (req.params.action == 'trash') {
		product.delete();
	}

	var io = req.app.get('io');
	io.to(shop._id.toString()).emit("update", "reload");

	return res.json(product);
});





module.exports = router;
