const mongoose = require('mongoose')
const AdminBro = require('admin-bro')
const AdminBroMongoose = require('@admin-bro/mongoose')
const AdminBroExpress = require('@admin-bro/express')
const uploadFeature = require('@admin-bro/upload')

AdminBro.registerAdapter(AdminBroMongoose)

const User = mongoose.model("User")
const Doctor = mongoose.model("Doctor")

const Country = mongoose.model("Country")
const City = mongoose.model("City")

const ADMIN = {
    email: 'admin',
    password: 'password',
}

const menu = {
    Models: { name: 'Models', icon: 'Dashboard' },
    Helpers: { name: 'Helpers', icon: 'Wheat' },
}

const adminBro = new AdminBro({
    assets: {
        styles: ['/admin.css']
    },
    branding: {
        companyName: 'HospalTrip',
        logo: false,
        softwareBrothers: false
    },
    resources: [{
      resource: User,
      options: {
        parent: menu.Models,
        listProperties: [ 'name', 'email', '_id'],
        editProperties: ['name', 'email'],
        showProperties: ['_id', 'name', 'email', 'createdAt']
      }
    },
    {
      resource: Doctor,
      options: {
        parent: menu.Models,
        listProperties: [ 'firstName', 'lastName', 'email', '_id'],
        showProperties: ['_id', 'firstName', 'lastName', 'email', 'createdAt'],
        mimeType: 's' 
      },
      features: [uploadFeature({
        provider: { aws: { region: 'eu-west-2', bucket: 'mainamodocbucket', accessKeyId: process.env.AWS_ACCESS_KEY_ID, secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY } },
        properties: {
          key: 'fileUrl', // to this db field feature will safe S3 key
          mimeType: 'mimeType' // this property is important because allows to have previews
        }
      })]
    },
    {
      resource: Country,
      options: {
        parent: menu.Helpers,
        listProperties: [ '_id', 'title'],
        editProperties: [ 'title' ],
        showProperties: ['_id', 'title', 'url']
      }
    },
    {
      resource: City,
      options: {
        parent: menu.Helpers,
        listProperties: [ '_id', 'title'],
        editProperties: [ 'title' ],
        showProperties: ['_id', 'title', 'url']
      }
    }
    ],
    locale: {
        translations: {
        messages: {
            loginWelcome: "To the best admin panel in the universe"
        }
        }
    },
    rootPath: '/admin',
})

const router = AdminBroExpress.buildAuthenticatedRouter(adminBro, {
    authenticate: async (email, password) => {
      if (ADMIN.password === password && ADMIN.email === email) {
        return ADMIN
      }
      return null
    },
    cookieName: 'adminbro',
    cookiePassword: 'somepassword',
})

module.exports = { adminBro, router }