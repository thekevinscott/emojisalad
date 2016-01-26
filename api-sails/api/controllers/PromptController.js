/**
 * PromptController
 *
 * @description :: Server-side logic for managing prompts
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
  destroy: function(req,res){
    return Prompt.update({ id: req.param('id') }, { archived: true })
    .exec(function (err, prompt) {
      if (err) return res.json(err, 400);
      return res.json(prompt[0]);
    });
  },
  find: function(req,res) {
    var archived = req.param('archived') || false;
    return Prompt.find({ archived: archived })
    .exec(function (err, prompts) {
      if (err) return res.json(err, 400);
      return res.json(prompts);
    });
  }
};
