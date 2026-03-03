
provider "azurerm" {
  features {}
}

resource "azurerm_resource_group" "feature_flags" {
  name     = "feature-flag-rg"
  location = "East US"
}

resource "azurerm_container_group" "feature_flags" {
  name                = "feature-flag-container"
  location            = azurerm_resource_group.feature_flags.location
  resource_group_name = azurerm_resource_group.feature_flags.name
  os_type             = "Linux"
}
