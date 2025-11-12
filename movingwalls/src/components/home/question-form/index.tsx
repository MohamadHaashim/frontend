import React, { Component } from "react";
import { Navigate } from "react-router-dom";
import '../../../views/Home/index.css';
import client from "../../../Graphql/apolloClient";
import { CONTACT_US_MUTATION } from "../../../Graphql/Queries";
import { toast } from "react-toastify";
import LandingImage from '../../../assets/images/mask-group-7@2x.png';
interface FormState {
  redirect: string | null;
  name: string;
  email: string;
  message: string;
  contact: string;
  companyName: string;
  error: string | null;
}

interface QuestionFormProps {
  showEmailField: boolean;
  showNamelField: boolean;
  showMessageField: boolean;
  showContactImg: boolean;
  showCNumber: boolean;
  contactImageField: string;
}

class QuestionForm extends Component<QuestionFormProps, FormState> {
  constructor(props: QuestionFormProps) {
    super(props);
    this.state = {
      redirect: null,
      name: '',
      email: '',
      message: '',
      companyName: '',
      contact: '',
      error: null,
    };
  }

  handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ [e.target.name]: e.target.value } as Pick<FormState, keyof FormState>);
  };
  handleChanges = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ companyName: e.target.value });
  };

  handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { name, email, message, companyName, contact } = this.state; // Exclude companyName and contact

    const body = `The following individual reached out to you via the OSS contact us page.\nName: ${name}\nEmail: ${email}\nMessage: ${message}\n Companyname: ${companyName}\nContact: ${contact}`;

    try {
      const response = await client.mutate({
        mutation: CONTACT_US_MUTATION,
        variables: {
          body,
          template: "",
        },
      });

      if (response.data.contactUs.status === "success") {
        toast.success("Your message has been sent successfully!");
        this.setState({
          name: "",
          email: "",
          message: "",
          companyName: "",
          contact: "",
          error: null,
        });
      } else {
        toast.error("Failed to send your message.");
      }
    } catch (error) {
      console.error("Error sending message:", error);
      // this.setState({ error: error instanceof Error ? error.message : "An unknown error occurred." });
    }
  };



  render() {
    if (this.state.redirect) {
      return <Navigate to={this.state.redirect} />;
    }

    const { showEmailField, showNamelField, showMessageField, showContactImg, contactImageField, showCNumber } = this.props;
    return (
      <div className="col-md-6">

        <div className={`question-cnt-right ${showContactImg ? 'show-image' : ''}`}
          style={{ backgroundImage: `url(${showContactImg && contactImageField ? LandingImage : ''})`, backgroundSize: 'cover', backgroundRepeat: 'no-repeat', margin: 'auto', padding: '20px', borderBottomLeftRadius: '25px', borderTopRightRadius: '25px', borderTopLeftRadius: '25px', borderBottomRightRadius: '25px' }} >
          <div className="question-form">
            <form onSubmit={this.handleSubmit}>
              {showNamelField && (
                <>
                  <label htmlFor="name">Full Name</label>
                  <input
                    type="text"
                    name="name"
                    value={this.state.name}
                    onChange={this.handleChange}
                    className="border-bottom-only no-focus-border"
                    required
                  />
                </>
              )}
              {showEmailField && (
                <>
                  <label htmlFor="email">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={this.state.email}
                    onChange={this.handleChange}
                    className="border-bottom-only no-focus-border"
                    required
                  />
                </>
              )}
              {showMessageField && (
                <>
                  <label htmlFor="message">Message</label>
                  <input
                    type="text"
                    name="message"
                    value={this.state.message}
                    onChange={this.handleChange}
                    className="border-bottom-only no-focus-border"
                    required
                  />
                </>
              )}
              <label htmlFor="companyName">Comapny Name</label>
              {/* {showCNumber && ( */}
              <input
                type="text"
                name="Comapny Name"
                className="border-bottom-only no-focus-border"
                value={this.state.companyName}
                onChange={this.handleChanges}
              />
              {/* )} */}
              <label htmlFor="contact">Contact</label>
              <input
                type="text"
                name="contact"
                value={this.state.contact}
                onChange={(e) => {
                  const value = e.target.value;
                  if (/^\d*$/.test(value)) {
                    this.handleChange(e);
                  }
                }}
                className="border-bottom-only no-focus-border"
              />

              <button type="submit">Contact Us</button>
            </form>
            {this.state.error && <p className="error">{this.state.error}</p>}
          </div>
        </div>
      </div>
    );
  }
}

export default QuestionForm;
