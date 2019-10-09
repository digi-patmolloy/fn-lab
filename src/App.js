// App.js
import React, { useState, useEffect } from "react";
import moment from "moment";
import "./App.css";
import { realtimeURL, restdb } from "./helper.js";
import { Button, Loader } from "semantic-ui-react";
import styled, { keyframes } from "styled-components";

const App = () => {
  const [ping, setPing] = useState(new Date());
  const [email, setEmail] = useState();
  const [latest, setLatest] = useState();
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState();

  // this.state = { ping: new Date(), evt: "", tickers: [] };

  // connect to the realtime database stream

  // check if the realtime connection is dead, reload client if dead
  useEffect(() => {
    let eventSource = new EventSource(realtimeURL);

    const interval = setInterval(() => {
      let now = new Date().getTime();
      let diff = (now - ping.getTime()) / 1000;
      // console.log(diff);
      // if (diff > 30) window.location.reload();
    }, 10000);
    const onPing = e => setPing(new Date());

    const onAdd = async e => {
      try {
        const id = JSON.parse(e.data).data;
        setLatest(id);
      } catch (error) {
        console.log(error);
      }
    };

    // listen for database REST operations
    eventSource.addEventListener("put", onAdd, false);
    eventSource.addEventListener("post", onAdd, false);
    eventSource.addEventListener("ping", onPing, false);

    return () => {
      clearInterval(interval);
      eventSource.removeEventListener("ping", onPing, false);
      eventSource.removeEventListener("put", onAdd, false);
      eventSource.removeEventListener("post", onAdd, false);
    };
  }, []);

  const submit = async () => {
    try {
      setSubmitting(true);
      const res = await restdb.patch(
        `/rest/dc-fnl-tracking-person/${latest._id}/`,
        {
          email
        }
      );
      setSubmitted(true);
      setSubmitting(false);
      setLatest(false);
      setTimeout(() => setSubmitted(false), 4000);
    } catch (error) {
      console.log(error);
      setSubmitting(false);
      setLatest(false);
    }
  };
  return (
    <Container
      style={{ background: latest || submitted ? "rgb(0, 209, 255)" : "#fff" }}
    >
      <Top></Top>
      <Middle>
        {submitted && (
          <Submitted>
            <img src="fn.svg"></img>
            <div style={{ marginTop: "1rem", fontWeight: 100 }}>thanks!</div>
          </Submitted>
        )}
        {!submitted && !latest && (
          <Waiting>
            <img src="start.png" style={{ width: 400 }} />
          </Waiting>
        )}
        {!submitted && latest && (
          <form
            onSubmit={async e => {
              try {
                setSubmitting(true);
                const res = await restdb.patch(
                  `/rest/dc-fnl-tracking-person/${latest._id}/`,
                  {
                    email
                  }
                );
                setSubmitted(true);
                setSubmitting(false);
                setLatest(false);
                setTimeout(() => setSubmitted(false), 4000);
              } catch (error) {
                console.log(error);
                setSubmitting(false);
                setLatest(false);
              }
              e.preventDefault();
              return false;
            }}
          >
            <Input
              autoFocus
              onKeyUp={e => setEmail(e.target.value)}
              placeholder="your@email.com"
              type="email"
              disabled={submitting}
            ></Input>
            <Buttons>
              {!submitting && (
                <Button type="button" onClick={() => setLatest("")}>
                  cancel
                </Button>
              )}
              <Button primary type="submit">
                {submitting ? (
                  <Loader size="tiny" inverted active inline />
                ) : (
                  "send me info!"
                )}
              </Button>
            </Buttons>
          </form>
        )}
      </Middle>
      <Bottom></Bottom>
    </Container>
  );
  return (
    <div className="App">
      <h1>{JSON.stringify(latest)}</h1>
    </div>
  );
};

const Submitted = styled.div`
  font-size: 3rem;
  color: #fff;
`;

// Create the keyframes
const rotate = keyframes`
  from {
    filter: grayscale(0%)
  }
  to {
    filter: grayscale(100%)
  }
`;

const Label = styled.label`
  font-size: 1.2rem;
  font-weight: 100;
  text-transform: uppercase;
`;

const Input = styled.input`
  font-size: 1.8rem;
  width: 500px;
  max-width: 90vw;
  padding: 1rem;
  outline: none;
  border: none;
`;
const Waiting = styled.div`
  animation: ${rotate} 2s linear infinite;
`;

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
  > div {
    max-width: 50%;
  }
  color: #fff;
`;
const Middle = styled.div`
  display: flex;
  flex-direction: column;
`;
const Buttons = styled.div`
  display: flex;
  flex-direction: row;
  margin-top: 0.5rem;
  justify-content: center;
  width: 100%;
  button {
    font-size: 1.3rem !important;
    padding: 0.5rem;
    margin: 0 1rem;
  }
`;
const Top = styled.div`
  align-self: flex-start;
`;

const Bottom = styled.div`
  align-self: flex-end;
`;

export default App;
