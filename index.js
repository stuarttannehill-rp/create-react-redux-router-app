#!/usr/bin/env node

const shell = require('shelljs')
const colors = require('colors')
const fs = require('fs')
const templates = require('./templates/templates.js')

let appName = process.argv[2]
let appDirectory = `${process.cwd()}/${appName}`

const createReactApp = () => {
	return new Promise(resolve => {
	if(appName) {
		shell.exec(`create-react-app ${appName}`, () => {
			console.log('Your base app has been created'.green)
			console.log("\nMoving on to install custom packages and templates...\n".cyan)
			resolve(true)
		})
	} else {
		console.log("\nNo app name was provided.".red)
		console.log("\nProvide an app name in the following format: ")
		console.log("\ncreate-react-redux-router-app ", "app-name\n".cyan)
		resolve(false)
	}	
	})
}

const cdIntoNewApp = () => {
	return new Promise(resolve => {
		shell.exec(`cd ${appName}`, () => {resolve()})
	})
}

const installPackages = () => {
	return new Promise(resolve=>{
	  console.log("\nInstalling redux, react-router, react-router-dom, react-redux, and redux-thunk\n".cyan)
	  shell.exec(`npm install --save redux react-router react-redux redux-thunk react-router-dom`, () => {
		console.log("\nFinished installing packages\n".green)
		resolve()
	  })
	})
  }

  const updateTemplates = () => {
	return new Promise(resolve=>{
	  let promises = []
	  Object.keys(templates).forEach((fileName, i)=>{
		promises[i] = new Promise(res=>{
		  fs.writeFile(`${appDirectory}/src/${fileName}`, templates[fileName], function(err) {
			  if(err) { return console.log(err) }
			  res()
		  })
		})
	  })
	  Promise.all(promises).then(()=>{resolve()})
	  console.log("\nFinished installing templates\n".green)
	})
  }

  const run = async () => {
	let success = await createReactApp()
	if(!success){
		console.log("\nOops, danger Will Robinson! create-react-app failed!".red)
		return false
	}
	await cdIntoNewApp()
	await installPackages()
	await updateTemplates()
	console.log("\nAll done...\n")
	console.log('🚀  Robots, mount up!\n')
}

run()