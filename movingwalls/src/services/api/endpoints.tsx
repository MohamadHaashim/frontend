let endpoints = {
	SIGNIN: '/Users/Login',
	SIGNUP: '/Users/Register',
	FORGOTPASSWORD: '/Users/ForgotPassword',
	ACTIVATION: '/Users/Activate',
	RESENTACTIVATION: '/Users/ResendActivationEmail',

	RESETPASSWORD: '/Users/ResetPassword',
	UPDATEUSER: '/Users/:id',
	USERBYID: '/Users/:id',
	USERME: '/Users/Me',
	LOGOUT: '/Users/Logout',
	
	USERONBOARDING: '/Users/Onboarding/ProfilePreferences',
	PROFILE: '/Users/Profile',
	UPDATEPROFILE: '/Users/Profile',
	UPDATEPROFILEIMAGE: '/Users/Profile',

	METADATA: '/MasterData',
}

let API = {
	SIGNIN_API_EP: {
		url: endpoints.SIGNIN, method: 'POST', authorization: false
	},
	SIGNUP_API_EP: {
		url: endpoints.SIGNUP, method: 'POST', authorization: false
	},
	FORGOTPASSWORD_API_EP: {
		url: endpoints.FORGOTPASSWORD, method: 'POST', authorization: false
	},
	ACTIVATION_EMAIL_API_EP: {
		url: endpoints.ACTIVATION, method: 'POST', authorization: false
	},
	RESEND_ACTIVATION_EMAIL_API_EP: {
		url: endpoints.RESENTACTIVATION, method: 'POST', authorization: false
	},

	//User
	RESETPASSWORD_API_EP: {
		url: endpoints.RESETPASSWORD, method: 'POST', authorization: true
	},
	UPDATE_USER_API_EP: {
		url: endpoints.UPDATEUSER, method: 'PUT', authorization: true
	},
	GET_USER_BY_ID_API_EP: {
		url: endpoints.USERBYID, method: 'POST', authorization: true
	},
	GET_USER_ME_API_EP: {
		url: endpoints.USERME, method: 'POST', authorization: true
	},
	USER_LOGOUT_API_EP: {
		url: endpoints.LOGOUT, method: 'POST', authorization: true
	},

	//Master
	GET_METADATA_API_EP: {
		url: endpoints.METADATA + '/Rules_Creation', method: 'GET', authorization: true
	},

	//Rules
	GET_RULES_METADATA_API_EP: {
		url: endpoints.METADATA + '/Rules_Creation', method: 'GET', authorization: true
	}
}

export default API;