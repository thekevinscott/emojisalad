import PropTypes from 'prop-types';

export const FriendPropType = PropTypes.shape({
  id: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]).isRequired,
  name: PropTypes.string.isRequired,
});

export const FriendsPropTypes = {
  friends: PropTypes.arrayOf(FriendPropType).isRequired,
  invitableFriends: PropTypes.arrayOf(FriendPropType).isRequired,
};
