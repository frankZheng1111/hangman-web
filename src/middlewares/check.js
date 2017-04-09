'use strict'
export function checkLogin(req, res, next) {
  if (!req.session.user) {
    req.flash('error', '未登录'); 
    return res.redirect('/users/signin');
  }
  next();
}

export function checkNotLogin(req, res, next) {
  if (req.session.user) {
    req.flash('error', '已登录'); 
    return res.redirect('/hangmen');
  }
  next();
}
