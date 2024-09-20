import headerStyles from '../trackfavmenu.module.css';
import { AppBar, Box, Button, IconButton, InputAdornment, Link, TextField, Toolbar, Typography } from '@mui/material';
import styles from './login.module.css';
import { closeLoginMenu, EMPTY_INPUT, ERROR_TOKEN, openLogin } from '../../manager/LoginManager';
import { closeHeader } from '../actions/HeaderHelper';
import React, { useContext, useEffect, useState } from 'react';
import { ReactComponent as CloseIcon } from '../../assets/icons/ic_action_close.svg';
import { useTranslation } from 'react-i18next';
import AppContext from '../../context/AppContext';
import { userActivate, userRegisterAndSendCode, validateUserToken } from '../../manager/AccountManager';
import i18n from 'i18next';
import { useNavigate } from 'react-router-dom';
import { formatString } from '../../manager/SettingsManager';
import { usePasswordValidation } from '../../util/hooks/usePasswordValidation';
import { Visibility, VisibilityOff } from '@mui/icons-material';

export default function CreateAccount() {
    const ctx = useContext(AppContext);

    const { t } = useTranslation();
    const lang = i18n.language;
    const navigate = useNavigate();

    const [userEmail, setUserEmail] = useState(EMPTY_INPUT);
    const [emailError, setEmailError] = useState(EMPTY_INPUT);
    const [code, setCode] = useState(EMPTY_INPUT);
    const [codeError, setCodeError] = useState(EMPTY_INPUT);
    const [sendCode, setSendCode] = useState(false);
    const [resendCode, setResendCode] = useState(false);
    const [resendEmail, setResendEmail] = useState(EMPTY_INPUT);
    const [openCodeInput, setOpenCodeInput] = useState(false);
    const [openPassword, setOpenPassword] = useState(false);
    const [userPassword1, setUserPassword1] = useState(EMPTY_INPUT);
    const [userPassword2, setUserPassword2] = useState(EMPTY_INPUT);
    const [showPassword1, setShowPassword1] = useState(false);
    const [showPassword2, setShowPassword2] = useState(false);
    const [createAccountError, setCreateAccountError] = useState(EMPTY_INPUT);

    const passwordError = usePasswordValidation(userPassword1, userPassword2);

    const EMAIL_IS_NOT_VALID = 'Email is not valid.';

    const handleClickShowPassword1 = () => {
        setShowPassword1(!showPassword1);
    };

    const handleMouseDownPassword1 = (event) => {
        event.preventDefault();
    };

    const handleClickShowPassword2 = () => {
        setShowPassword2(!showPassword2);
    };

    const handleMouseDownPassword2 = (event) => {
        event.preventDefault();
    };

    const handleCodeChange = (e) => {
        setCode(e.target.value);
    };

    const handleResendEmailChange = (e) => {
        setUserEmail(e.target.value);
        setResendEmail(e.target.value);
    };

    const handlePassword1Change = (e) => {
        setUserPassword1(e.target.value);
    };

    const handlePassword2Change = (e) => {
        setUserPassword2(e.target.value);
    };

    useEffect(() => {
        if (emailError !== EMPTY_INPUT) {
            setSendCode(false);
        }
        if (sendCode && emailError === EMPTY_INPUT) {
            setOpenCodeInput(true);
            if (resendCode) {
                setResendCode(false);
            }
        }
    }, [sendCode, emailError]);

    useEffect(() => {
        if (openPassword) {
            if (codeError !== EMPTY_INPUT) {
                setOpenPassword(false);
            } else {
                setOpenCodeInput(false);
            }
        }
    }, [openPassword]);

    useEffect(() => {
        if (codeError !== EMPTY_INPUT) {
            if (code === EMPTY_INPUT) {
                setCodeError(false);
            }
            if (codeError === ERROR_TOKEN) {
                setCodeError(t('web:expired_code'));
            }
        }
    }, [codeError]);

    const handleEmailChange = (e) => {
        if (emailError !== EMPTY_INPUT) {
            setEmailError(EMPTY_INPUT);
        }
        setUserEmail(e.target.value);
    };

    const handleKeyPress = async (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            await sendVerificationCode(true);
        }
    };

    async function sendVerificationCode(isNew) {
        await userRegisterAndSendCode({ username: userEmail, setError: setEmailError, lang, isNew }).then(() => {
            setSendCode(true);
        });
    }

    async function validateToken() {
        await validateUserToken({ username: userEmail, token: code, setError: setCodeError }).then(() => {
            setOpenPassword(true);
        });
    }

    async function createAccount() {
        userActivate({
            username: userEmail,
            pwd: userPassword1,
            token: code,
            setError: setCreateAccountError,
            lang,
        }).then(() => {
            if (createAccountError === EMPTY_INPUT) {
                ctx.setOpenLoginMenu(true);
                ctx.setLoginState({ default: true });
            }
        });
    }

    return (
        <>
            <AppBar position="static" className={headerStyles.appbar}>
                <Toolbar className={headerStyles.toolbar}>
                    <IconButton
                        id={'se-create-account-menu-close'}
                        variant="contained"
                        type="button"
                        className={styles.closeIcon}
                        onClick={() => {
                            closeLoginMenu(ctx);
                            closeHeader({ ctx });
                        }}
                    >
                        <CloseIcon />
                    </IconButton>
                    <Typography id="se-create-account-menu-name" component="div" className={headerStyles.title}>
                        {t('register_opr_create_new_account')}
                    </Typography>
                </Toolbar>
            </AppBar>
            <Box sx={{ mx: 2, my: 1 }}>
                {openPassword && (
                    <>
                        <Typography className={styles.loginText}>{t('web:create_password_desc')}</Typography>
                        {createAccountError && (
                            <Typography className={styles.loginText}>{createAccountError}</Typography>
                        )}
                        <Box className={passwordError && styles.errorBack}>
                            <TextField
                                margin="dense"
                                onChange={handlePassword1Change}
                                id="pwd1"
                                label={t('user_password')}
                                type={showPassword1 ? 'text' : 'password'}
                                fullWidth
                                variant="filled"
                                value={userPassword1 ? userPassword1 : EMPTY_INPUT}
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton
                                                onClick={handleClickShowPassword1}
                                                onMouseDown={handleMouseDownPassword1}
                                            >
                                                {showPassword1 ? <Visibility /> : <VisibilityOff />}
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                }}
                            />
                            <TextField
                                margin="dense"
                                onChange={handlePassword2Change}
                                id="pwd2"
                                label={t('web:confirm_password')}
                                type={showPassword2 ? 'text' : 'password'}
                                fullWidth
                                variant="filled"
                                helperText={passwordError ? passwordError : EMPTY_INPUT}
                                error={passwordError.length > 0}
                                value={userPassword2 ? userPassword2 : EMPTY_INPUT}
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton
                                                onClick={handleClickShowPassword2}
                                                onMouseDown={handleMouseDownPassword2}
                                            >
                                                {showPassword2 ? <Visibility /> : <VisibilityOff />}
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                }}
                            />
                        </Box>
                        <Box sx={{ mt: 2 }}>
                            <Button
                                disabled={
                                    userPassword1 === EMPTY_INPUT ||
                                    userPassword2 === EMPTY_INPUT ||
                                    code === EMPTY_INPUT ||
                                    passwordError !== EMPTY_INPUT
                                }
                                className={styles.primaryButton}
                                onClick={createAccount}
                            >
                                {t('web:create_account')}
                            </Button>
                        </Box>
                    </>
                )}
                {openCodeInput && (
                    <>
                        <Typography className={styles.loginText}>
                            {formatString(t('web:send_code_desc'), [userEmail])}
                        </Typography>
                        {resendCode ? (
                            <Box className={resendCode && styles.errorBack}>
                                <TextField
                                    margin="dense"
                                    onChange={handleResendEmailChange}
                                    id="username"
                                    label={t('web:user_email')}
                                    type="email"
                                    fullWidth
                                    variant="filled"
                                    value={userEmail}
                                    helperText={emailError ? emailError : t('web:resend_code_desc')}
                                />
                                <Button
                                    sx={{ mb: 1.5, backgroundColor: '#DEEBFF !important' }}
                                    className={styles.button}
                                    component="span"
                                    onClick={() => sendVerificationCode(resendEmail === userEmail)}
                                >
                                    {t('web:resend_btn')}
                                </Button>
                            </Box>
                        ) : (
                            <Box className={codeError && styles.errorBack}>
                                <TextField
                                    margin="dense"
                                    onChange={handleCodeChange}
                                    id="code"
                                    label={t('web:verification_code')}
                                    fullWidth
                                    variant="filled"
                                    value={code ? code : EMPTY_INPUT}
                                    helperText={codeError ? codeError : EMPTY_INPUT}
                                />
                            </Box>
                        )}
                        {!resendCode && (
                            <Typography className={styles.loginText}>
                                <Link
                                    onClick={() => {
                                        setResendCode(true);
                                        setSendCode(false);
                                        setOpenPassword(false);
                                        setCodeError(EMPTY_INPUT);
                                    }}
                                    target="_blank"
                                    underline="none"
                                >
                                    {t('web:resend_code_link')}
                                </Link>
                            </Typography>
                        )}
                        <Box sx={{ mt: resendCode ? '15px' : '30px' }}>
                            <Button
                                disabled={code === EMPTY_INPUT}
                                className={styles.primaryButton}
                                onClick={validateToken}
                            >
                                {t('shared_string_continue')}
                            </Button>
                        </Box>
                    </>
                )}
                {!openCodeInput && !openPassword && (
                    <>
                        <Typography className={styles.loginText}>{t('web:create_account_desc')}</Typography>
                        <Box className={emailError && styles.errorBack}>
                            <TextField
                                autoFocus
                                margin="dense"
                                onChange={handleEmailChange}
                                onKeyDown={(e) => handleKeyPress(e)}
                                id="username"
                                label={t('web:user_email')}
                                type="email"
                                fullWidth
                                variant="filled"
                                helperText={emailError ? emailError : EMPTY_INPUT}
                                value={userEmail}
                            />
                            {emailError !== EMPTY_INPUT && emailError !== EMAIL_IS_NOT_VALID && (
                                <Button
                                    sx={{ mb: 1.5, mt: 0.5 }}
                                    className={styles.blueButton}
                                    component="span"
                                    onClick={() => openLogin(ctx, navigate)}
                                >
                                    {t('web:login_btn')}
                                </Button>
                            )}
                        </Box>
                        <Box sx={{ mt: 2 }}>
                            <Button
                                disabled={userEmail === EMPTY_INPUT}
                                className={styles.primaryButton}
                                onClick={() => sendVerificationCode(true)}
                            >
                                {t('shared_string_continue')}
                            </Button>
                        </Box>
                    </>
                )}
            </Box>
        </>
    );
}
