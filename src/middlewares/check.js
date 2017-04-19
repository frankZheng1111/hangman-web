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

export function checkResHeaderHtml(req, res, next) {
  if ('text/html' !== res.get('Content-Type')) {
    return res.json({ error: "404 NOT FOUND" });
  }
  next();
}
