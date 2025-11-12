import React, { Component } from "react";
import { Navigate } from "react-router-dom";

interface ClientIcon {
  ClientIcons: { data: { url: string } }[];
}

interface FormState {
  redirect: string | null;
  content: any;
  clientLogogField: ClientIcon[];
  backgroundImage: string;
  contactImage: string;
  authToken: string | null;
  facebook: string;
}

class ClientServed extends Component<{}, FormState> {
  constructor(props: {}) {
    super(props);
    this.state = {
      redirect: null,
      content: null,
      clientLogogField: [],
      backgroundImage: '',
      contactImage: '',
      authToken: null,
      facebook: '',
    };
  }

  async componentDidMount() {
    try {
      const response = await fetch(`${process.env.PUBLIC_URL}/json/contentJson.json`);
      const data = await response.json();
      const value = data.find((page: any) => page.name === "Landing Page");

      if (value) {
        const clientLogogField = value.fields.find((field: any) => field.title === "Clients we have served");
        if (clientLogogField) {
          this.setState({
            clientLogogField: clientLogogField.components[1]?.defaultValue || []
          });
        }
        const token = localStorage.getItem('authToken');
        this.setState({ authToken: token });
      }
    } catch (error) {
      console.error("Error fetching content:", error);
    }
  }

  render() {
    if (this.state.redirect) {
      return <Navigate to={this.state.redirect} />;
    }

    return (
      <div className="client-served-container d-flex justify-content-center">
        <div className="client-served-images row justify-content-center">
          {this.state.clientLogogField.map((clientEntry, index) => (
            clientEntry.ClientIcons.map((icon, subIndex) => (
              <div className="client_img col-md-2 d-flex justify-content-center" key={`${index}-${subIndex}`}>
                <img src={icon.data.url} alt={`Client ${index + 1}`} className="img-fluid" />
              </div>
            ))
          ))}
        </div>
      </div>
    );
  }
}

export default ClientServed;
