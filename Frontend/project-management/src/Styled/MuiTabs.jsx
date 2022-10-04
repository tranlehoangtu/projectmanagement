import { Box, Tab, Tabs } from "@mui/material";
import PropTypes from "prop-types";
function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
        </div>
    );
}

TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.number.isRequired,
    value: PropTypes.number.isRequired,
};

const MuiTabs = (props) => {
    const { tab, handleInputChange, tabLabels, tabValues } = props;

    return (
        <Box sx={{ width: "100%" }}>
            <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                <Tabs
                    value={tab}
                    onChange={(event, nValue) => {
                        handleInputChange(nValue);
                    }}
                    aria-label="basic tabs"
                >
                    {tabLabels.map((label) => (
                        <Tab key={label.id} label={label.name} />
                    ))}
                </Tabs>
            </Box>
            {tabValues.map((tabValue, index) => {
                return (
                    <TabPanel key={tabValue.id} value={tab} index={index}>
                        {tabValue.value}
                    </TabPanel>
                );
            })}
        </Box>
    );
};

export default MuiTabs;
