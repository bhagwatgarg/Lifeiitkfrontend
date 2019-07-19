import React, { useEffect } from 'react';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import Chip from '@material-ui/core/Chip';
import { Fab } from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
import axios from "axios";
import AddIcon from "@material-ui/icons/Add";
import { API_ROOT } from "../../../api-config";

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
    maxWidth: 300,
  },
  chips: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  chip: {
    margin: 2,
  },
  noLabel: {
    marginTop: theme.spacing(3),
  },
  grid: {
    marginLeft: 15,
    marginTop: 10,
    maxWidth: 370,
  }
}));

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};



function getStyles(name, personName, theme) {
  return {
    fontWeight:
      personName.indexOf(name) === -1
        ? theme.typography.fontWeightRegular
        : theme.typography.fontWeightMedium,
  };
}

export default function Tags() {
  const classes = useStyles();
  const theme = useTheme();
  const [personName, setPersonName] = React.useState([]);
  const [tagNames, setTagName] = React.useState([]);
  const [subTagNames, setSubTagName] = React.useState([]);
  const [toSubTagNames, setToSubTagName] = React.useState("");
  const addTag = () => {
    axios({
      method: "put",
      url: `${API_ROOT}/users/tags/`,
      data: { name: toSubTagNames },
      withCredentials: true
    }).then(() => getSubTagName(setSubTagName));
  };
  const deleteTag = index => {
    axios({
      method: "delete",
      url: `${API_ROOT}/users/tags/delete/`,
      data: { tag_id: index },
      withCredentials: true
    }).then(() => getSubTagName(setSubTagName));
  };

  const getTagName = (set) => {
    axios.get(`${API_ROOT}/tags/all/`).then(response => {
      set(response.data);
    });
  };

  const getSubTagName = (set) => {
    axios.get(`${API_ROOT}/users/profile/`, { withCredentials: true }).then(response => {
      console.log(response.data.tags);
      set(response.data.tags);
    });
  };

  useEffect(() => {
    getTagName(setTagName);
    getSubTagName(setSubTagName);
  }, []);

  function changeToSub(event) {
    setToSubTagName(event.target.value);
  }
  const order = [];
  function arrangeTags() {
    let i;
    let tempWords = [];
    for (i = 0; i < tagNames.length; i++) {
      tempWords.push(tagNames[i]["name"]);
      order.push(i);
    };

    let j;

    for (i = 0; i < tempWords.length; i++) {
      let s = tempWords[i];
      let min = i;
      for (j = i + 1; j < tempWords.length; j++) {
        if (tempWords[j] < s) {
          s = tempWords[j];
          min = j;
        };
      };

      let temp = tempWords[i];
      tempWords[i] = tempWords[min];
      tempWords[min] = temp;

      temp = order[i];
      order[i] = order[min];
      order[min] = temp;
    };
  }

  return tagNames.length === 0 ? (
    "Loading..."
  ) : (
      <div className={classes.root}>
        {/* <Grid 
            container
            direction="row"
            alignContent="center"
            spacing={1}
            className={classes.grid}
        > */}
        {/* <Grid item> */}
        <FormControl className={classes.formControl}>
          <div>
            <InputLabel htmlFor="select-multiple-chip">Tags</InputLabel>
            <Select
              style={{ marginRight: 0.5 + 'em' }}
              value={toSubTagNames}
              onChange={changeToSub}
              inputProps={{
                name: 'age',
                id: 'age-simple',
              }}
            >
    {arrangeTags()}
              {
                order.map(id => (
                  <MenuItem key={tagNames[id].tag_id} value={tagNames[id].name} style={getStyles(tagNames[id].name, personName, theme)}>
                    {tagNames[id].name}
                  </MenuItem>
                ))}
            </Select>

            <Fab
              color="primary"
              size="small"
              onClick={addTag}
              className={classes.fab}
            >
              <AddIcon />
            </Fab>
          </div>
          {subTagNames.map((tag) => (
            <Chip
              key={tag.tag_id}
              label={tag.name}
              color="primary"
              margin="dense"
              onDelete={() => deleteTag(tag.tag_id)}
              className={classes.chip}
            />
          ))}

        </FormControl>
        {/* </Grid> */}
        {/* </Grid>       */}
      </div>
    );
}
