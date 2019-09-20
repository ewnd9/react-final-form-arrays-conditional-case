import React from 'react';
import {render} from 'react-dom';
import Styles from './Styles';
import {Form, Field} from 'react-final-form';
import arrayMutators from 'final-form-arrays';
import {FieldArray} from 'react-final-form-arrays';

const grid = 8;
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

const onSubmit = async values => {
  await sleep(300);
  window.alert(JSON.stringify(values, 0, 2));
};

let nextId = 1;

const App = () => {
  const [tabIndex, setTabIndex] = React.useState(0);

  return (
    <Styles>
      <h1>🏁 React Final Form - Array Fields</h1>
      <a href="https://github.com/erikras/react-final-form#-react-final-form">Read Docs</a>
      <Form
        onSubmit={onSubmit}
        mutators={{
          ...arrayMutators,
        }}
        initialValues={{customers: [{id: 1, firstName: 'x'}, {id: 2, firstName: 'y'}, {id: 3, firstName: 'z'}]}}
        render={({handleSubmit, pristine, reset, submitting, values, form}) => {
          return (
            <form onSubmit={handleSubmit}>
              <div>
                <label>Company</label>
                <Field name="company" component="input" />
              </div>
              <div className="buttons">
                <button type="button" onClick={() => form.mutators.push('customers', {id: nextId++})}>
                  Add Customer
                </button>
                <button type="button" onClick={() => form.mutators.pop('customers')}>
                  Remove Customer
                </button>
              </div>
              <Field
                name="customers"
                render={({input}) => {
                  return (
                    <React.Fragment>
                      {input.value.map((x, index) => (
                        <span
                          key={index}
                          style={{margin: '5px', fontWeight: tabIndex === index ? 'bold' : 'normal'}}
                          onClick={e => {
                            setTabIndex(index);
                          }}
                        >
                          {index}
                        </span>
                      ))}
                    </React.Fragment>
                  );
                }}
              />
              <FieldArray name="customers">
                {({fields}) =>
                  fields.map((name, index) =>
                    tabIndex !== index ? null : (
                      <div key={name}>
                        <Field name={`${name}.id`}>
                          {({input: {name, value}}) => <label name={name}>Cust. #{value}</label>}
                        </Field>
                        <Field name={`${name}.firstName`} component="input" placeholder="First Name" />
                        <input
                          type="text"
                          value={index}
                          onChange={({target: {value}}) => {
                            console.log('here');
                            form.mutators.move('customers', index, value);
                            console.log(value);
                          }}
                        />
                        <span onClick={() => fields.remove(index)} style={{cursor: 'pointer'}}>
                          ❌
                        </span>
                      </div>
                    ),
                  )
                }
              </FieldArray>

              <div className="buttons">
                <button type="submit" disabled={submitting || pristine}>
                  Submit
                </button>
                <button type="button" onClick={reset} disabled={submitting || pristine}>
                  Reset
                </button>
              </div>
              <pre>{JSON.stringify(values, 0, 2)}</pre>
            </form>
          );
        }}
      />
    </Styles>
  );
};

render(<App />, document.getElementById('root'));
