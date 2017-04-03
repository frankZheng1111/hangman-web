export default function (app) {
  app.use((req, res) => {
    res.status(404).render('404',  { layout: false });
  });
}
