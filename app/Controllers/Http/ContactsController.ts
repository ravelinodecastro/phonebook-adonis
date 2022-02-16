import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Contact from 'App/Models/Contact'
import { schema } from '@ioc:Adonis/Core/Validator'
import ContactValidator from 'App/Validators/ContactValidator'

export default class ContactsController {
  public async index(ctx: HttpContextContract) {
    const search = ctx.request.input('search');
    const contacts = await Contact.query()
    .where((query) => {
      if (search){
        query.where('first_name', 'LIKE', '%'+search+'%')
        .orWhere('last_name', 'LIKE', '%'+search+'%')
        .orWhere('phone', 'LIKE', '%'+search+'%')
      }
    })
    .exec()
    return { message: 'Operação realizada com sucesso.', data: contacts}
  }
  public async create(ctx: HttpContextContract) {
    const newContactSchema = schema.create({
      first_name: schema.string({ trim: true }),
      last_name: schema.string({ trim: true }),
      phone: schema.string({ trim: true }),
    })
  
    /**
     * Validate request body against the schema
     */
     try {
      const payload = await ctx.request.validate({
        schema: newContactSchema
      })
      const contact = await Contact.create(
        payload
        //ctx.request.only(['first_name', 'last_name','phone'])
      )
      return { message: 'Operação realizada com sucesso.', data: contact}

    } catch (error) {
      ctx.response.badRequest(error.messages)
    }
  }
  public async show(ctx: HttpContextContract) {
    const contact = await Contact.findOrFail(ctx.request.param('id'))
    return { message: 'Operação realizada com sucesso.', data: contact}
  }
  public async update(ctx: HttpContextContract) {
    await ctx.request.validate(ContactValidator)
    const contact = await Contact.findOrFail(ctx.request.param('id'))
    contact.first_name = ctx.request.input('first_name')
    contact.last_name = ctx.request.input('last_name')
    contact.phone = ctx.request.input('phone')
    await contact.save()
    return { message: 'Operação realizada com sucesso.', data: contact}
  }
  public async destroy(ctx: HttpContextContract) {
    const contact = await Contact.findOrFail(ctx.request.param('id'))
    await contact.delete()
    return { message: 'Operação realizada com sucesso.'}
  }
}