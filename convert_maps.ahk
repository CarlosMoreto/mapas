#Include <default_settings>
#Include <useful_functions>
#Include <selenium_functions>

Write_Console("resetLog=true")

mapSimpRatio := 0
url_mapshaper := "https://mapshaper.org/"
dir_src := A_ScriptDir "\TopoJSON\"
dir_dest := A_ScriptDir "\GeoJSON\"
driver := Start_Webdriver("profile=Profile_Carlos")

obj_files_maps := Get_Files_In_Folder(dir_src, "*.json")
mapCount := obj_files_maps.MaxIndex()
idx := 1

for o, obj_file in obj_files_maps {
	path_src := obj_file.path
	path_dest := dir_dest obj_file.fullname
	map := obj_file.name
	
	Write_Console("Converting maps from """ dir_src """ (" idx "/" mapCount ")")
	Write_Console("`r`nChecking file", false)
	
	if(FileExist(path_dest)) {
		idx++
		continue
	}
	
	Write_Console("Converting maps from """ dir_src """ (" idx "/" mapCount ")")
	Write_Console("`r`nOpening URL", false)
	Driver_Get(driver, url_mapshaper)
	
	Write_Console("Converting maps from """ dir_src """ (" idx "/" mapCount ")")
	Write_Console("`r`nImporting zip", false)
	Get_Element_By_XPath(driver, "//span[text() = 'select']", "waitElmAppear=true").click()
	
	if(Win_Open(path_src)) {
		;~ Get_Element_By_XPath(driver, "//div[text() = 'Import']", "waitElmAppear=true").click()
		
		if(mapSimpRatio) {
			Write_Console("Converting maps from """ dir_src """ (" idx "/" mapCount ")")
			Write_Console("`r`nSimplifying", false)
			
			if(!Simplify_Map(driver, mapSimpRatio))
				Write_Console("Map repair error: """ map """", "writeLog=true")
		}
		
		Write_Console("Converting maps from """ dir_src """ (" idx "/" mapCount ")")
		Write_Console("`r`nExporting", false)
		Get_Element_By_XPath(driver, "//span[text() = 'Export']", "waitElmAppear=true").click()
		Get_Element_By_XPath(driver, "//input[@value = 'geojson']", "waitElmAppear=true").click()
		Get_Element_By_XPath(driver, "//div[text() = 'Export']", "waitElmAppear=true").click()
		Win_Save_As(path_dest)
	}
	
	idx++
}

Write_Console("Done!", "endMsg=true")
return

+Esc::ExitApp

Simplify_Map(driver, simpRatio) {
	Get_Element_By_XPath(driver, "//span[text() = 'Simplify']", "waitElmAppear=true").click()
	Get_Element_By_XPath(driver, "//input[@class = 'checkbox import-retain-opt']", "waitElmAppear=true").click()
	Get_Element_By_XPath(driver, "//input[@value = 'weighted_visvalingam']", "waitElmAppear=true").click()
	Get_Element_By_XPath(driver, "//div[@class = 'submit-btn btn dialog-btn default-btn']", "waitElmAppear=true").click()
	
	webelm_simplify := Get_Element_By_XPath(driver, "//input[@class = 'clicktext']", "waitElmAppear=true").click()
	simpRatio := simpRatio ".0%"
	
	driver.executeScript("document.getElementsByClassName('clicktext')[0].value = '" simpRatio "'")
	Send_Keys(webelm_simplify, driver.keys.enter)
	
	webelm_repair := Get_Element_By_XPath(driver, "//div[@class = 'repair-btn text-btn colored-text']", 500)
	
	if(webelm_repair) {
		driver.executeScript("document.getElementsByClassName('repair-btn text-btn colored-text')[0].click()")
		Sleep 500
		
		if(Get_Element_By_XPath(driver, "//div[@class = 'intersection-count']/span[@class = 'icon']", 500))
			return false
	}
	
	Sleep 500
	return true
}
