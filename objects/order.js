var util = require('../objects/util');

exports.action = function(req, res, control, action, url) {

	try {



		if ( action == 'sendmail' && url[0] == 'confirm' ) {
			if (typeof req.body.orderNo == 'undefined' || req.body.orderNo == '' ||
				typeof req.body.items == 'undefined' || req.body.items == '' ||
				typeof req.body.qty == 'undefined' || req.body.qty == '' ||
				typeof req.body.price == 'undefined' || req.body.price == '' ||
				typeof req.body.name == 'undefined' || req.body.name == '' ||
				typeof req.body.nickname == 'undefined' || req.body.nickname == '' ||
				typeof req.body.telephoneNo == 'undefined' || req.body.telephoneNo == '' ||
				typeof req.body.shopName == 'undefined' || req.body.shopName == '' ) {
				data.error = 'Please fill out all required fields';
				res.json(data);
			}
			else {
				var config = require('../config.js');
				var nodemailer = require('nodemailer');
				var fs = require('fs');

				var senderName = (typeof req.body.senderName != 'undefined' && req.body.senderName != '') ? req.body.senderName : config.gmail.senderName;
				var senderEmail = (typeof req.body.senderEmail != 'undefined' && req.body.senderEmail != '') ? req.body.senderEmail : config.gmail.senderEmail;
				var smtpTransport = nodemailer.createTransport('SMTP', {
					service: 'Gmail',
					auth: {
						XOAuth2: {
							user: config.gmail.username,
							clientId: config.gmail.clientId,
							clientSecret: config.gmail.clientSecret,
							refreshToken: config.gmail.refreshToken
						}
					}
				});

				var transporter = nodemailer.createTransport({
					service: 'gmail',
					auth: {
						user: config.gmail.username,
						pass: config.gmail.password
					}
				});

				fs.readFile('/var/www/remaxthailand/24fin-api/views/email/new-order.html', function read(err, message) {
					if (err)
					{
						data.error = err;
						res.json(data);
					}
					else {
						var html = (''+message).replace(/REPLACEORDERID/g, req.body.orderNo)
							.replace(/REPLACEITEM/g, req.body.items)
							.replace(/REPLACEQTY/g, req.body.qty)
							.replace(/REPLACEPRICE/g, req.body.price)
							.replace(/REPLACENAME/g, req.body.name)
							.replace(/REPLACENICKNAME/g, req.body.nickname)
							.replace(/REPLACESHOP/g, req.body.shopName)
							.replace(/REPLACETEL/g, req.body.telephoneNo);
						var mailOptions = {
							from: senderName + ' <' + senderEmail + '>',
							to: config.order.emailOfficer,
							//bcc: config.order.emailBcc,
							subject: 'คุณมีรายการสั่งซื้อหมายเลข ' + req.body.orderNo + ' เข้ามาใหม่',
							generateTextFromHTML: true,
							html: html,
							attachments: [
								{
									filename: 'ใบจองสินค้า '+req.body.orderNo+'.pdf',
									path: 'https://seller.24fin.com/reports/order.php?orderNo='+req.body.orderNo
								}
							]
						};

						transporter.sendMail(mailOptions, function(error, info){
							if(error){
								data.error = error;
							} else {
								data.info = info.response;
								data.success = true;
								delete data.error;
							}
							smtpTransport.close();
							res.json(data);
						});

					}
				});
			}
		}
		else if ( action == 'cart') {
			if ( url[0] == 'update' ) {
				if (typeof req.body.authKey == 'undefined' || req.body.authKey == '' ||
					typeof req.body.productCode == 'undefined' || req.body.productCode == '' ||
					typeof req.body.qty == 'undefined' || req.body.qty == '' ) {
					data.error = 'Please fill out all required fields';
					res.json(data);
				}
				else {
					util.query(req, res, control, 'data', 'EXEC sp_CartUpdate \''+req.body.authKey+'\', \''+req.body.productCode+'\', \''+req.body.qty+'\'');
				}
			}
			else if ( url[0] == 'detail' ) {
				if (typeof req.body.authKey == 'undefined' || req.body.authKey == '') {
					data.error = 'Please fill out all required fields';
					res.json(data);
				}
				else {
					util.query(req, res, control, 'data', 'EXEC sp_DataCartDetail \''+req.body.authKey+'\'');
				}
			}
			else if ( url[0] == 'summary' ) {
				if (typeof req.body.authKey == 'undefined' || req.body.authKey == '') {
					data.error = 'Please fill out all required fields';
					res.json(data);
				}
				else {
					util.query(req, res, control, 'data', 'EXEC sp_DataCartSummary \''+req.body.authKey+'\'');
				}
			}
		}
		else if ( action == 'booking') {
			if ( url[0] == 'update' ) {
				if (typeof req.body.authKey == 'undefined' || req.body.authKey == '' ||
					typeof req.body.productCode == 'undefined' || req.body.productCode == '' ||
					typeof req.body.qty == 'undefined' || req.body.qty == '' ) {
					data.error = 'Please fill out all required fields';
					res.json(data);
				}
				else {
					util.query(req, res, control, 'data', 'EXEC RemaxThailand..sp_BookingUpdate \''+req.body.authKey+'\', \'88888888\', \''+req.body.productCode+'\', \''+req.body.qty+'\'');
				}
			}
			else if ( url[0] == 'cancel' ) {
				if (typeof req.body.authKey == 'undefined' || req.body.authKey == '' ||
					typeof req.body.productCode == 'undefined' || req.body.productCode == '') {
					data.error = 'Please fill out all required fields';
					res.json(data);
				}
				else {
					util.query(req, res, control, 'data', 'EXEC RemaxThailand..sp_BookingCancel \''+req.body.authKey+'\', \'88888888\', \''+req.body.productCode+'\'');
				}
			}
			else if ( url[0] == 'memberCancel' ) {
				if (typeof req.body.authKey == 'undefined' || req.body.authKey == '' ||
					typeof req.body.productCode == 'undefined' || req.body.productCode == '') {
					data.error = 'Please fill out all required fields';
					res.json(data);
				}
				else {
					util.query(req, res, control, 'data', 'EXEC RemaxThailand..sp_BookingMemberCancel \''+req.body.member+'\', \'88888888\', \''+req.body.productCode+'\'');
				}
			}
			else if ( url[0] == 'addCart' ) {
				if (typeof req.body.authKey == 'undefined' || req.body.authKey == '' ||
					typeof req.body.productCode == 'undefined' || req.body.productCode == '' ) {
					data.error = 'Please fill out all required fields';
					res.json(data);
				}
				else {
					util.query(req, res, control, 'data', 'EXEC RemaxThailand..sp_BookingAddCart \''+req.body.authKey+'\', \'88888888\', \''+req.body.productCode+'\'');
				}
			}
			else if ( url[0] == 'list' ) {
				if (typeof req.body.authKey == 'undefined' || req.body.authKey == '') {
					data.error = 'Please fill out all required fields';
					res.json(data);
				}
				else {
					util.queryMultiple(req, res, control, 'resultList', 'EXEC RemaxThailand..sp_BookingList');
				}
			}
			else if ( url[0] == 'lock' ) {
				if (typeof req.body.authKey == 'undefined' || req.body.authKey == '' ||
					typeof req.body.productCode == 'undefined' || req.body.productCode == ''  ||
					typeof req.body.member == 'undefined' || req.body.member == ''  ||
					typeof req.body.locked == 'undefined' || req.body.locked == '' ) {
					data.error = 'Please fill out all required fields';
					res.json(data);
				}
				else {
					util.query(req, res, control, 'data', 'EXEC RemaxThailand..sp_BookingLock \''+req.body.authKey+'\', \'88888888\', \''+req.body.productCode+'\', \''+req.body.member+'\', \''+req.body.locked+'\'');
				}
			}
			/*else if ( url[0] == 'detail' ) {
				if (typeof req.body.authKey == 'undefined' || req.body.authKey == '') {
					data.error = 'Please fill out all required fields';
					res.json(data);
				}
				else {
					util.query(req, res, control, 'data', 'EXEC sp_DataCartDetail \''+req.body.authKey+'\'');
				}
			}
			else if ( url[0] == 'summary' ) {
				if (typeof req.body.authKey == 'undefined' || req.body.authKey == '') {
					data.error = 'Please fill out all required fields';
					res.json(data);
				}
				else {
					util.query(req, res, control, 'data', 'EXEC sp_DataCartSummary \''+req.body.authKey+'\'');
				}
			}*/
		}
		else if ( action == 'approve') {
			if (typeof req.body.authKey == 'undefined' || req.body.authKey == '' ||
				typeof req.body.orderNo == 'undefined' || req.body.orderNo == '' ) {
				data.error = 'Please fill out all required fields';
				res.json(data);
			}
			else {
				util.query(req, res, control, 'data', 'UPDATE OrderHeader SET isApprove = 1, updateDate = GETDATE() WHERE orderNo = \''+req.body.orderNo+'\'');
			}
		}
		else if ( action == 'premium') {
			if (typeof req.body.authKey == 'undefined' || req.body.authKey == '' ||
				typeof req.body.orderNo == 'undefined' || req.body.orderNo == ''  ||
				typeof req.body.status == 'undefined' || req.body.status == '' ) {
				data.error = 'Please fill out all required fields';
				res.json(data);
			}
			else {
				util.query(req, res, control, 'data', 'UPDATE OrderHeader SET isPremium = '+req.body.status+', updateDate = GETDATE() WHERE orderNo = \''+req.body.orderNo+'\'');
			}
		}
		else if ( action == 'printed') {
			if (typeof req.body.authKey == 'undefined' || req.body.authKey == '' ||
				typeof req.body.orderNo == 'undefined' || req.body.orderNo == '' ||
				typeof req.body.status == 'undefined' || req.body.status == ''   ) {
				data.error = 'Please fill out all required fields';
				res.json(data);
			}
			else {
				util.query(req, res, control, 'data', 'UPDATE OrderHeader SET isPrint = '+req.body.status+', updateDate = GETDATE() WHERE orderNo = \''+req.body.orderNo+'\'');
			}
		}
		else if ( action == 'event') {
			if (typeof req.body.authKey == 'undefined' || req.body.authKey == '' ||
				typeof req.body.orderNo == 'undefined' || req.body.orderNo == '' ||
				typeof req.body.status == 'undefined' || req.body.status == '' ||
				typeof req.body.startDate == 'undefined' || req.body.startDate == ''||
				typeof req.body.endDate == 'undefined' || req.body.endDate == ''  ) {
				data.error = 'Please fill out all required fields';
				res.json(data);
			}
			else {
				var startDate = req.body.startDate.split('/');
				var endDate = req.body.endDate.split('/');
				util.query(req, res, control, 'success', 'EXEC sp_OrderEventUpdate \''+req.body.authKey+'\', \''+req.body.orderNo+'\', \''+startDate[2]+'/'+startDate[1]+'/'+startDate[0]+'\', \''+endDate[2]+'/'+endDate[1]+'/'+endDate[0]+'\', \''+req.body.status+'\'');
			}
		}
		else if ( action == 'coupon') {
			if ( url[0] == 'info' ) {
				if (typeof req.body.authKey == 'undefined' || req.body.authKey == '' ||
					typeof req.body.couponCode == 'undefined' || req.body.couponCode == '' ) {
					data.error = 'Please fill out all required fields';
					res.json(data);
				}
				else {
					util.query(req, res, control, 'data', 'EXEC sp_DataCouponInfo \''+req.body.authKey+'\', \''+req.body.couponCode+'\'');
				}
			}
		}
		else if ( action == 'update') {
			if (typeof req.body.authKey == 'undefined' || req.body.authKey == '' ||
				typeof req.body.productCode == 'undefined' || req.body.productCode == '' ||
				typeof req.body.qty == 'undefined' || req.body.qty == '' ) {
				data.error = 'Please fill out all required fields';
				res.json(data);
			}
			else {
				util.query(req, res, control, 'success', 'EXEC sp_OrderUpdate \''+req.body.authKey+'\', \''+req.body.productCode+'\', \''+req.body.qty+'\'');
			}
		}
		else if ( action == 'confirm') {
			if (typeof req.body.authKey == 'undefined' || req.body.authKey == '' ) {
				data.error = 'Please fill out all required fields';
				res.json(data);
			}
			else {
				util.query(req, res, control, 'confirm', 'EXEC sp_OrderConfirm \''+req.body.authKey+'\', \''+req.body.coupon+'\'');
			}
		}
		else if ( action == 'summary') {
			if ( url[0] == 'month' ) {
				if (typeof req.body.authKey == 'undefined' || req.body.authKey == '' ||
					typeof req.body.year == 'undefined' || req.body.year == '' ||
					typeof req.body.month == 'undefined' || req.body.month == '') {
					data.error = 'Please fill out all required fields';
					res.json(data);
				}
				else {
					util.query(req, res, control, 'data', 'EXEC sp_DataOrderHeaderByMonth \''+req.body.authKey+'\', '+(parseInt(req.body.year)%2000)+', '+req.body.month);
				}
			}
			if ( url[0] == 'istpack' ) {
				if (typeof req.body.authKey == 'undefined' || req.body.authKey == '' ||
					typeof req.body.year == 'undefined' || req.body.year == '' ||
					typeof req.body.month == 'undefined' || req.body.month == '') {
					data.error = 'Please fill out all required fields';
					res.json(data);
				}
				else {
					util.query(req, res, control, 'data', 'EXEC sp_DataOrderHeaderIstPack \''+req.body.authKey+'\', '+(parseInt(req.body.year)%2000)+', '+req.body.month);
				}
			}
		}
		else if ( action == 'tracking') {
			if ( url[0] == 'update' ) {
				if (typeof req.body.orderNo == 'undefined' || req.body.orderNo == '' ||
					typeof req.body.type == 'undefined' || req.body.type == '' ) {
					data.error = 'Please fill out all required fields';
					res.json(data);
				}
				else {
					util.query(req, res, control, 'success', 'EXEC sp_ShippingUpdate \''+req.body.orderNo+'\', \''+req.body.type+'\', \''+( ( typeof req.body.trackingNo == 'undefined' || req.body.trackingNo == '' ) ? '' : req.body.trackingNo)+'\'');
				}
			}
			else if ( url[0] == 'paid' ) {
				if (typeof req.body.orderNo == 'undefined' || req.body.orderNo == '' ) {
					data.error = 'Please fill out all required fields';
					res.json(data);
				}
				else {
					util.queryMultiple(req, res, control, 'data', 'EXEC sp_PaidDetail \''+req.body.orderNo+'\'');
				}
			}
		}
		else if ( action == 'credit') {
			if ( url[0] == 'comment' ) {
				if (typeof req.body.orderNo == 'undefined' || req.body.orderNo == '' ||
					typeof req.body.comment == 'undefined' || req.body.comment == '' ||
						typeof req.body.dueDate == 'undefined' || req.body.dueDate == '' ) {
					data.error = 'Please fill out all required fields';
					res.json(data);
				}
				else {
					var sp = req.body.dueDate.split('/');
					util.query(req, res, control, 'success', 'EXEC sp_CreditCommentUpdate 88888888, \''+req.body.orderNo+'\', \''+req.body.comment+'\', \''+sp[2]+'-'+sp[1]+'-'+sp[0]+'\'');
				}
			}
		}
		else if ( action == 'search') {
			if (typeof req.body.sku == 'undefined' || req.body.sku == '' ) {
				data.error = 'Please fill out all required fields';
				res.json(data);
			}
			else {
				util.query(req, res, control, 'data', 'SELECT p.sku, od.orderNo, od.qty FROM AzureTempDB..OrderDetail od LEFT JOIN AzureTempDB..OrderHeader oh ON od.orderNo = oh.orderNo LEFT JOIN RemaxThailand..Product p ON od.product = p.id AND p.shop = 88888888 WHERE oh.active = 1 AND isPack = 0 AND p.sku = \''+req.body.sku+'\' ORDER BY od.orderNo DESC');
			}
		}
		else {
		  res.json(data);
		}

	}
	catch(err) {
		data.error = err.message;
		data.stack = err.stack;
		res.json(data);
	}
};

exports.process = function(req, res, action, recordset) {
  if (action == 'data') {
	  data.success = true;
	  data.correct = typeof recordset != 'undefined';
	  if (data.correct) {
		  data.result = recordset;
	  }
  }
  else if (action == 'success') {
	  data.success = true;
  }
  else if ( action == 'resultList' ) {
	  data.success = true;
	  data.correct = typeof recordset[1] != 'undefined';
	  if (data.correct) {
		  data.result = recordset[1];
		  data.booking = recordset[2];
		  data.customer = recordset[3];
	  }
  }
  else if (action == 'confirm') {
	  data.success = true;
	  data.correct = typeof recordset != 'undefined';
	  if (data.correct) {
		  data.result = recordset;


			var config = require('../config.js');
			var nodemailer = require('nodemailer');
			var fs = require('fs');

			var senderName = config.gmail.senderName;
			var senderEmail = config.gmail.senderEmail;
			var smtpTransport = nodemailer.createTransport('SMTP', {
				service: 'Gmail',
				auth: {
					XOAuth2: {
						user: config.gmail.username,
						clientId: config.gmail.clientId,
						clientSecret: config.gmail.clientSecret,
						refreshToken: config.gmail.refreshToken
					}
				}
			});

			var transporter = nodemailer.createTransport({
				service: 'gmail',
				auth: {
					user: config.gmail.username,
					pass: config.gmail.password
				}
			});

			/*if (recordset[0]['emailMember'] != null && recordset[0]['emailMember'] != '') {
				fs.readFile('/var/www/remaxthailand/24fin-api/views/email/new-order4customer.html', function read(err, message) {
					if (err)
					{
						//data.error = err;
						//res.json(data);
						console.log(err);
					}
					else {
						var html = (''+message).replace(/REPLACEORDERID/g, recordset[0]['orderNo'])
							.replace(/REPLACEITEM/g, numberWithCommas(recordset[0]['items']))
							.replace(/REPLACEQTY/g, numberWithCommas(recordset[0]['qty']))
							.replace(/REPLACEPRICE/g, numberWithCommas(recordset[0]['price']))
							.replace(/REPLACEHOUR/g, recordset[0]['orderExpireHours']);

						var mailOptions = {//emailMember
							from: senderName + ' <' + senderEmail + '>',
							to: recordset[0]['emailMember'],
							replyTo: config.order.emailReply,
							subject: 'ยืนยันคำสั่งซื้อหมายเลข '+recordset[0]['orderNo']+' เรียบร้อยแล้ว',
							generateTextFromHTML: true,
							html: html,
							attachments: [
								{
									filename: 'ใบจองสินค้า '+recordset[0]['orderNo']+'.pdf',
									path: 'https://24fin-api.remaxthailand.co.th/report/order4customer/1/'+recordset[0]['orderNo']
								}
							]
						};

						transporter.sendMail(mailOptions, function(error, info){
							if(error){
								//data.error = error;
								console.log(err);
							} else {
								//data.info = info.response;
								//data.success = true;
								//delete data.error;
							}
							smtpTransport.close();
							//res.json(data);
						});

					}
				});
			}*/

			fs.readFile('/var/www/remaxthailand/24fin-api/views/email/new-order.html', function read(err, message) {
				if (err)
				{
					//data.error = err;
					//res.json(data);
					console.log(err);
				}
				else {
					var html = (''+message).replace(/REPLACEORDERID/g, recordset[0]['orderNo'])
						.replace(/REPLACEITEM/g, numberWithCommas(recordset[0]['items']))
						.replace(/REPLACEQTY/g, numberWithCommas(recordset[0]['qty']))
						.replace(/REPLACEPRICE/g, numberWithCommas(recordset[0]['price']))
						.replace(/REPLACENAME/g, recordset[0]['name'])
						.replace(/REPLACENICKNAME/g, recordset[0]['contactName'])
						.replace(/REPLACESHOP/g, recordset[0]['shopName'])
						.replace(/REPLACETEL/g, recordset[0]['mobile']);

					var mailOptions = {
						from: senderName + ' <' + senderEmail + '>',
						to: config.order.emailSalesOfficer,
						/*bcc: config.order.emailBcc+((recordset[0]['emailSale'] != null && recordset[0]['emailSale'] != '') ? ','+recordset[0]['emailSale']: '')+
							((recordset[0]['emailHeadSale'] != null && recordset[0]['emailHeadSale'] != '') ? ','+recordset[0]['emailHeadSale'] : '')+
							((recordset[0]['emailManager'] != null && recordset[0]['emailManager'] != '') ? ','+recordset[0]['emailManager'] : ''),*/
						subject: 'คุณมีรายการสั่งซื้อหมายเลข  '+recordset[0]['orderNo']+' เข้ามาใหม่',
						generateTextFromHTML: true,
						html: html,
						attachments: [
							{
								filename: 'ใบจองสินค้า '+recordset[0]['orderNo']+'.pdf',
								path: 'https://24fin-api.remaxthailand.co.th/report/order4office/1/'+recordset[0]['orderNo']
							}
						]
					};

					transporter.sendMail(mailOptions, function(error, info){
						if(error){
							//data.error = error;
							console.log(err);
						} else {
							//data.info = info.response;
							//data.success = true;
							//delete data.error;
						}
						smtpTransport.close();
						//res.json(data);
					});

				}
			});

	  }
  }

  //if (action != 'confirm') {
	  if (data.success) delete data.error;
	  res.json(data);
  //}
}


exports.error = function(req, res, action, err) {
	data.error = err;
	res.json(data);
}

function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
