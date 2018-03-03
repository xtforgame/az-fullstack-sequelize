import { capitalizeFirstLetter } from 'common/utils';

export default class TextFieldHelper {
  constructor(component){
    this.component = component;
    this.fields = {};
  }

  add(...fields){
    fields.map(field => {
      this.fields[field.name] = {
        type: 'text',
        defaultValue: '',
        onChangePropName: `on${capitalizeFirstLetter(field.name)}Change`,
        errorPropName: `${field.name}Error`,
        validate: value => value != null && value != '',
        ...field,
      };
    })
  }

  remove(...fieldNames){
    fieldNames.map(fieldName => {
      delete this.fields[fieldName];
    })
  }

  // ==========================

  getInitState(){
    const state = {};
    Object.keys(this.fields).map(fieldName => {
      const {
        type,
        defaultValue,
      } = this.fields[fieldName];
      state[fieldName] = defaultValue;
      state[`${fieldName}ShowEmptyError`] = false;
      if(type === 'password'){
        state[`${fieldName}Visible`] = false;
      }
    });
    return state;
  }

  updateState(fieldName, value){
    this.component.setState({
      [fieldName]: value,
      [`${fieldName}ShowEmptyError`]: this.component.state[`${fieldName}ShowEmptyError`] && !value,
    });
  }

  validate(){
    let result = true;
    let newState = {};
    Object.keys(this.fields).map(fieldName => {
      if(!this.fields[fieldName].validate(this.component.state[fieldName])){
        newState[`${fieldName}ShowEmptyError`] = true;
        result = false;
      }
    });

    if(!result){
      this.component.setState(newState);
    }
    return result;
  }

  getErrorStatus(fieldName, validateError){
    let occurred = false;
    let message = undefined;
    const errorFromProps = this.component.props[this.fields[fieldName].errorPropName];
    if(this.component.state[`${fieldName}ShowEmptyError`]){
      message = validateError;
      occurred = true;
    }else if(!!errorFromProps){
      message = errorFromProps === true ? '' : errorFromProps;
      occurred = true;
    }
    return {
      occurred,
      message,
    };
  }

  // handlers
  handleChange = (fieldName) => event => {
    const value = event.target.value;
    const onChangePropName = this.fields[fieldName].onChangePropName;
    const onChange = this.component.props[onChangePropName] || (() => {});
    onChange(value);
    this.updateState(fieldName, value);
  };

  handleVisibleSwitch = (fieldName) => () => {
    this.component.setState({ [`${fieldName}Visible`]: !this.component.state[`${fieldName}Visible`] });
  };

  //
  getPropsForInputField = (fieldName, validateError) => {
    let field = this.fields[fieldName];
    
    const {
      occurred,
      message,
    } = this.getErrorStatus(fieldName, validateError);

    const props = {
      value: this.component.state[fieldName],
      onChange: this.handleChange(fieldName),
      formProps: {
        error: occurred,
      },
      helperText: message,
    };

    if(field.type === 'password'){
      props.type = this.component.state[`${fieldName}Visible`] ? 'text' : 'password';
      props.onShowPassswordClick = this.handleVisibleSwitch(fieldName);
    }

    return props;
  };
}
