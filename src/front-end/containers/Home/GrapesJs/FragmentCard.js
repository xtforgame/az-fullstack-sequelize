import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles({
  root: {
    maxWidth: 345,
  },
});

export default function ImgMediaCard(props) {
  const {
    margin = 8,
    image = 'images/StockSnap_3FOSIEZDTW.jpg',
    fragmentFilename = 'Fragment 001.agf',
    onClick,
  } = props;

  const classes = useStyles();

  const fragmentName = fragmentFilename.split('.')[0];

  return (
    <Card className={classes.root} style={{ margin }}>
      <CardActionArea onClick={onClick}>
        <CardMedia
          component="img"
          alt={fragmentName}
          height="140"
          image={image}
          title={fragmentName}
        />
        <CardContent>
          <Typography gutterBottom variant="h5" component="h2">
            {fragmentName}
          </Typography>
          {/* <Typography variant="body2" color="textSecondary" component="p">
            Lizards are a widespread group of squamate reptiles, with over 6,000 species, ranging
            across all continents except Antarctica
          </Typography> */}
        </CardContent>
      </CardActionArea>
      {/* <CardActions>
        <Button size="small" color="primary">
          Share
        </Button>
        <Button size="small" color="primary">
          Learn More
        </Button>
      </CardActions> */}
    </Card>
  );
}
