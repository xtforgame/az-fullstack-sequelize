import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import BotCard from '../Bot/BotCard';
import botPastureStatus from '../botPastureStatus';

const styles = {
};

class Bots extends React.Component {
  render() {
    const status = botPastureStatus && botPastureStatus.status;
    const bots = (status && status.bots) || [];
    // console.log('bots :', bots);
    return (
      <div>
        {bots.map(bot => (
          <BotCard
            key={bot.name}
            name={bot.name}
            botInfo={bot.botInfo}
            heapStatistics={bot.heapStatistics}
          />
        ))}
      </div>
    );
  }
}

export default withStyles(styles)(Bots);
