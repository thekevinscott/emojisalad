import { connect } from 'react-redux';

function getWrappedComponent(
  component,
  [
    mapStateToProps,
    mapDispatchToProps,
    mergeProps,
    options,
  ],
) {
  return connect(
    mapStateToProps,
    mapDispatchToProps,
    mergeProps,
    {
      ...options,
      withRef: true,
    },
  )(component);
}

export default getWrappedComponent;
