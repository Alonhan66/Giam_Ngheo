import headerStyles from '../trackfavmenu.module.css';
import { AppBar, IconButton, Toolbar, Tooltip, Typography } from '@mui/material';
import styles from '../configuremap/configuremap.module.css';
import { closeHeader } from '../actions/HeaderHelper';
import CloseIcon from '@mui/icons-material/Close';
import React, { useContext, useRef, useState } from 'react';
import ActionsMenu from '../actions/ActionsMenu';
import WeatherForecastSourceActions from './WeatherForecastSourceActions';
import WeatherLayersActions from './WeatherLayersActions';
import AppContext from '../../context/AppContext';
import { ReactComponent as ForecastSourceIcon } from '../../assets/icons/ic_action_umbrella.svg';
import { ReactComponent as WeatherLayersIcon } from '../../assets/icons/ic_map_configure_map.svg';
import { useTranslation } from 'react-i18next';

export default function WeatherHeader() {
    const ctx = useContext(AppContext);

    const { t } = useTranslation();
    const [openForecastActions, setOpenForecastActions] = useState(false);
    const [openLayersActions, setOpenLayersActions] = useState(false);
    const anchorForecastSource = useRef(null);
    const anchorWeatherLayers = useRef(null);

    function getActions(e, anchorEl, setOpenActions) {
        setOpenActions(true);
        ctx.setOpenedPopper(anchorEl);
        e.stopPropagation();
    }

    return (
        <>
            <AppBar position="static" className={headerStyles.appbar}>
                <Toolbar className={headerStyles.toolbar}>
                    <IconButton
                        variant="contained"
                        type="button"
                        className={styles.closeIcon}
                        onClick={() => closeHeader(ctx)}
                    >
                        <CloseIcon />
                    </IconButton>
                    <Typography id="se-configure-map-menu-name" component="div" className={headerStyles.title}>
                        {t('shared_string_weather')}
                    </Typography>
                    <Tooltip key={'forecast_source'} title={t('web:forecast_source')} arrow placement="bottom-end">
                        <span>
                            <IconButton
                                id="se-forecast_source"
                                variant="contained"
                                type="button"
                                className={headerStyles.appBarIcon}
                                onClick={(e) => getActions(e, anchorForecastSource, setOpenForecastActions)}
                                ref={anchorForecastSource}
                            >
                                <ForecastSourceIcon />
                            </IconButton>
                        </span>
                    </Tooltip>
                    <Tooltip key={'weather_layers'} title={t('web:weather_layers')} arrow placement="bottom-end">
                        <span>
                            <IconButton
                                id="se-weather_layers"
                                variant="contained"
                                type="button"
                                className={headerStyles.appBarIcon}
                                onClick={(e) => getActions(e, anchorWeatherLayers, setOpenLayersActions)}
                                ref={anchorWeatherLayers}
                            >
                                <WeatherLayersIcon />
                            </IconButton>
                        </span>
                    </Tooltip>
                </Toolbar>
            </AppBar>
            <ActionsMenu
                open={openForecastActions}
                setOpen={setOpenForecastActions}
                anchorEl={anchorForecastSource}
                actions={<WeatherForecastSourceActions setOpenActions={setOpenForecastActions} />}
            />
            <ActionsMenu
                open={openLayersActions}
                setOpen={setOpenLayersActions}
                anchorEl={anchorWeatherLayers}
                actions={<WeatherLayersActions />}
            />
        </>
    );
}
